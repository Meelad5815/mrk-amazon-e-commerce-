const products=[
{id:1,name:'MRK Pro Wireless Headphones',cat:'electronics',price:7499,old:9999,icon:'🎧',rating:'★★★★★',badge:'BEST SELLER'},
{id:2,name:'Smart Watch Series X',cat:'electronics',price:5999,old:7999,icon:'⌚',rating:'★★★★☆',badge:'DEAL'},
{id:3,name:'Premium Everyday Sneakers',cat:'fashion',price:4299,old:5999,icon:'👟',rating:'★★★★★',badge:'POPULAR'},
{id:4,name:'Minimal Travel Backpack',cat:'fashion',price:3299,old:4499,icon:'🎒',rating:'★★★★☆',badge:''},
{id:5,name:'Modern Desk Lamp',cat:'home',price:2499,old:3499,icon:'💡',rating:'★★★★★',badge:'DEAL'},
{id:6,name:'Ceramic Coffee Set',cat:'home',price:1899,old:2599,icon:'☕',rating:'★★★★☆',badge:''},
{id:7,name:'Wireless Bluetooth Speaker',cat:'electronics',price:3799,old:4999,icon:'🔊',rating:'★★★★★',badge:'NEW'},
{id:8,name:'Everyday Care Kit',cat:'beauty',price:2199,old:2999,icon:'✨',rating:'★★★★☆',badge:''}
];
let cart=JSON.parse(localStorage.getItem('mrkCart')||'[]');
let activeFilter='all',search='';
const grid=document.getElementById('productGrid'),empty=document.getElementById('emptyState');
const money=n=>'Rs. '+n.toLocaleString('en-PK');
function renderProducts(){const items=products.filter(p=>(activeFilter==='all'||p.cat===activeFilter)&&(!search||p.name.toLowerCase().includes(search.toLowerCase())));grid.innerHTML=items.map(p=>`<article class="product"><div class="product-img">${p.icon}</div>${p.badge?`<span class="badge">${p.badge}</span>`:''}<div class="product-body"><div class="rating">${p.rating}</div><h3>${p.name}</h3><div><span class="price">${money(p.price)}</span><span class="old">${money(p.old)}</span></div><button class="add" data-add="${p.id}">Add to cart</button></div></article>`).join('');empty.hidden=items.length>0;document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>addToCart(+b.dataset.add));}
function save(){localStorage.setItem('mrkCart',JSON.stringify(cart));renderCart();}
function addToCart(id){const p=products.find(x=>x.id===id),item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});save();toast(p.name+' added to cart');}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);save();}
function renderCart(){const count=cart.reduce((s,x)=>s+x.qty,0);document.getElementById('cartCount').textContent=count;const wrap=document.getElementById('cartItems');if(!cart.length){wrap.innerHTML='<div class="empty">Your cart is empty.<br><small>Add something you love.</small></div>';}else wrap.innerHTML=cart.map(x=>{const p=products.find(y=>y.id===x.id);return `<div class="cart-item"><div class="mini">${p.icon}</div><div><strong>${p.name}</strong><small>${money(p.price)} each</small><div class="qty"><button data-minus="${p.id}">−</button><span>${x.qty}</span><button data-plus="${p.id}">+</button></div></div><strong>${money(p.price*x.qty)}</strong></div>`}).join('');const total=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);document.getElementById('cartTotal').textContent=money(total);wrap.querySelectorAll('[data-minus]').forEach(b=>b.onclick=()=>changeQty(+b.dataset.minus,-1));wrap.querySelectorAll('[data-plus]').forEach(b=>b.onclick=()=>changeQty(+b.dataset.plus,1));}
function openCart(){document.getElementById('cartDrawer').classList.add('open');document.getElementById('overlay').classList.add('show');document.getElementById('cartDrawer').setAttribute('aria-hidden','false')}
function closeCart(){document.getElementById('cartDrawer').classList.remove('open');document.getElementById('overlay').classList.remove('show');document.getElementById('cartDrawer').setAttribute('aria-hidden','true')}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),2200)}
document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeFilter=b.dataset.filter;renderProducts();});
document.querySelectorAll('.category').forEach(b=>b.onclick=()=>{activeFilter=b.dataset.category;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x.dataset.filter===activeFilter));document.getElementById('products').scrollIntoView({behavior:'smooth'});renderProducts()});
document.getElementById('searchForm').onsubmit=e=>{e.preventDefault();search=document.getElementById('searchInput').value.trim();activeFilter=document.getElementById('categorySelect').value;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x.dataset.filter===activeFilter));renderProducts();document.getElementById('products').scrollIntoView({behavior:'smooth'});};
document.getElementById('categorySelect').onchange=e=>{activeFilter=e.target.value;renderProducts()};
document.getElementById('cartBtn').onclick=openCart;document.getElementById('closeCart').onclick=closeCart;document.getElementById('overlay').onclick=closeCart;
document.getElementById('checkoutBtn').onclick=()=>{if(!cart.length)return toast('Your cart is empty');toast('Checkout is ready — connect your payment gateway next.');};
document.getElementById('accountBtn').onclick=()=>toast('Customer account module coming next.');
document.getElementById('menuBtn').onclick=()=>document.getElementById('categories').scrollIntoView({behavior:'smooth'});
document.getElementById('newsletterForm').onsubmit=e=>{e.preventDefault();toast('Thanks! You are subscribed to MRK Insider.');e.target.reset()};
renderProducts();renderCart();
