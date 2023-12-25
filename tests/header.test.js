const Page = require("./helpers/page")
let page;
beforeEach(async ()=>{
    page = await Page.build();
    await page.goto("http://localhost:3000");
})

afterEach(async ()=>{
    await page.close()
})

test("The header has correct text ", async()=>{
    const text = await page.getContentsOf("a.brand-logo")
    // $eval("a.brand-logo", el=> el.innerHTML);
    expect(text).toEqual("Blogster");

})

// test("clicking login starts oauth flo w", async()=>{
//     await page.click(".right a");
//     let pageURL = await page.url();
//    expect(pageURL).toMatch(/accounts\.google\.com/);
// })



test("when signed in , shows logout button", async()=>{
    await page.login();
    const text = await page.getContentsOf('a[href="/auth/logout"]')
    expect(text).toEqual("Logout");
})

