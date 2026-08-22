(() => {
  const product4 = {
    id: 4,
    name: "Reebok Karman Women's Sneakers - Walking Shoes",
    cat: "fashion",
    price: 0,
    old: 0,
    image: "https://m.media-amazon.com/images/P/B0G5SSVWQM.01._SL1500_.jpg",
    rating: "★★★★★",
    badge: "NEW",
    affiliateUrl: "https://www.amazon.com/Reebok-Karman-Womens-Sneakers-Walking/dp/B0G5SSVWQM?crid=QCF96TGTGV5G&dib=eyJ2IjoiMSJ9.Hdf_xl0Km5jD5z6Trw7MpdCZBQHK2cw_OANbbLsqMbhBhLRvYhD_kTb5RpHUC944vY07fYg4wRrZBIit5MHPPvpnsDxYCW_0WXg57ThkeugDUNdUlNr_RMswAxJ80XpAjIwYlv2sLutuWMPppalqUk8TbK1H2p_BuCsRf5rtmD-Zq7_Xg_-ZmL2JJ1y3_N023OrmuklyEwsChTizyjOSs9XcwNHiE9g0x3TvcHFHR9VfAeCdPva5MQMb4KDiy85G5c2ISWFJgUYNdkYig636pWZBlyTKKZDc8b3ukjVOpx4.zPVK4bRYdgKmPOBSWun84R5CV2r36r9R6J5UIHUnB8I&dib_tag=se&keywords=Premium%2BEveryday%2BSneakers&qid=1787204759&sprefix=%2Caps%2C2042&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&psc=1&linkCode=ll2&tag=mrkstore03-20&linkId=85b366c5f3e941ae6b1b275ab823532e&language=en_US&gaOptInStatus=true&ref_=as_li_ss_tl",
    asin: "B0G5SSVWQM",
    model: "Karman",
    details: "Women's sneakers · Walking / everyday wear · Reebok Karman",
    ratingsCount: 0
  };

  function syncProduct() {
    try {
      if (typeof products !== "undefined" && Array.isArray(products)) {
        const i = products.findIndex(p => p && p.id === 4);
        if (i >= 0) products[i] = { ...products[i], ...product4 };
        else products.push(product4);
      }
    } catch (_) {}

    const grid = document.getElementById("productGrid");
    if (!grid) return;

    const title = "Reebok Karman Women's Sneakers - Walking Shoes";
    let card = [...grid.querySelectorAll(".product")].find(el => {
      const h = el.querySelector("h3");
      return h && (h.textContent.includes("Premium Everyday Sneakers") || h.textContent.includes("Reebok Karman"));
    });

    const category = document.getElementById("categorySelect");
    const search = document.getElementById("searchInput");
    const categoryOk = !category || category.value === "all" || category.value === "fashion";
    const query = (search?.value || "").trim().toLowerCase();
    const queryOk = !query || title.toLowerCase().includes(query) || "reebok karman sneakers walking shoes".includes(query);
    if (!categoryOk || !queryOk) return;

    if (!card) {
      card = document.createElement("article");
      card.className = "product";
      grid.appendChild(card);
    }

    card.dataset.id = "4";
    card.innerHTML = `
      <span class="badge">NEW</span>
      <div class="product-img"><img src="${product4.image}" alt="${title}" loading="lazy"></div>
      <div class="product-body">
        <div class="rating">★★★★★</div>
        <h3>${title}</h3>
        <div class="price">See Amazon price</div>
        <button class="add" type="button" data-id="4">View on Amazon</button>
      </div>`;

    const button = card.querySelector(".add");
    button.addEventListener("click", () => {
      window.open(product4.affiliateUrl, "_blank", "noopener,noreferrer");
    }, { once: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", syncProduct, { once: true });
  else syncProduct();

  const grid = document.getElementById("productGrid");
  if (grid) {
    const observer = new MutationObserver(() => {
      clearTimeout(window.__mrkProduct4Timer);
      window.__mrkProduct4Timer = setTimeout(syncProduct, 20);
    });
    observer.observe(grid, { childList: true, subtree: true });
  }
  ["searchInput", "categorySelect"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", () => setTimeout(syncProduct, 50));
    document.getElementById(id)?.addEventListener("change", () => setTimeout(syncProduct, 50));
  });
})();
