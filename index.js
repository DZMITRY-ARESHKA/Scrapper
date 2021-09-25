const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto("https://catalog.onliner.by/mobile", {
    waitUntil: "load",
    timeout: 0,
  });
  await page.waitForSelector(".schema-pagination__main");
  let elems = await page.$$eval(".schema-product__group", (element) =>
    element.map((el) => {
      let price = Number.parseInt(
        el.querySelector(".schema-product__price span").innerHTML
      );
      let name = el.querySelector(".schema-product__title span").innerHTML;
      return { name, price };
    })
  );
  elems.sort((a, b) => a.price - b.price);
  elems.forEach((a) => {
    let b = a.name.split(" ");
    a.type = b[0];
    a.vendor = b[1];
    a.name = b.slice(2, b.length).join(" ");
  });
  elems = elems.filter((a) => a.vendor == "Xiaomi");
  console.log(elems);
  await browser.close();
})();
