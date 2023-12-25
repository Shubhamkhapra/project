const Page = require("./helpers/page")
let page;
beforeEach(async ()=>{
    page = await Page.build();
    await page.goto("http://localhost:3000");
})

afterEach(async ()=>{
    await page.close()
})


describe("when logged in", async()=>{
    beforeEach(async()=>{
        await page.login();
        await page.click('a.btn-floating');
    });

    it('can see create from ', async() => {
        const label =  await page.getContentsOf('form label');
        expect(label).toEqual('Blog Title');
    });

    describe("and using valid inputs", async()=>{
        beforeEach(async()=>{
            await page.type('.title input', 'my title');
            await page.type('.content input', 'my content');
            await page.click('form button')
        })
        it('submitting takes user review screen', async () => {
            const text = await page.getContentsOf('h5');
            expect(text).toEqual('Please confirm your entries');
          });

          it('submitting then saving adds blog to index page', async () => {
            await page.click('button.green');
            await page.waitFor('.card');
            const title =  await page.getContentsOf('.card-title');
            const content = await page.getContentsOf('p');

            expect(title).toEqual("my title")
            expect(content).toEqual("my content")
          });
    })
    
    describe("and using invalid inputs", async()=>{
        beforeEach(async()=>{
            await page.click('form button');
        })
        it('the from shows an error message ', async () => {
            const titleError = await page.getContentsOf('.title .red-text');
            const contentError = await page.getContentsOf('.content .red-text');

            expect(titleError).toEqual("You must provide a value")
            expect(contentError).toEqual("You must provide a value")

        });
    });



})


describe("user is not logged in", async()=>{
    it('user cannot create blog posts ', async () => {
        const result = await page.evaluate(
            ()=>{
               return fetch('api/blogs', {
                    method: "POST",
                    credentials : "same-origin",
                    headers:{
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        title: "my new title",
                        content : "my new content"
                    })
                }).then(res => res.json());

            }
        );

       expect(result).toEqual( { error: 'You must log in!' })
    });


    it('user cannot get a list of posts', async () => {
        const result=  await page.evaluate(
            ()=>{
                return fetch('api/blogs', {
                    method: "GET",
                    credentials : "same-origin",
                    headers:{
                        "Content-Type" : "application/json"
                    }
                }).then(res => res.json());
            }
        )
        expect(result).toEqual({ error: 'You must log in!' })
    });
})