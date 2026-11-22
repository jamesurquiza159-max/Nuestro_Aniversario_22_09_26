/* Configuración: escribe aquí la fecha real en formato ISO. Se deja vacía para no inventarla. */
const CONFIG = { anniversaryDate: '2025-11-22T00:00:00', memories: [
  { image:'assets/1.jpeg', title:'Donde todo se siente más bonito' }, { image:'assets/2.jpeg', title:'Una sonrisa que me sé de memoria' }, { image:'assets/3.jpeg', title:'Nuestra forma favorita de pasarla bien' }, { image:'assets/4.jpeg', title:'Tú, yo y un poquito de magia' }, { image:'assets/5.jpeg', title:'Aventuras que se quedan para siempre' }, { image:'assets/6.jpeg', title:'Mi lugar favorito sigue siendo contigo' }
]};

const $ = (selector) => document.querySelector(selector);
const loader = $('#loader'), main = $('#mainContent'), progress = $('#progressBar'), progressNumber = $('#progressNumber');
let loaded = 0; const total = CONFIG.memories.length;
const finishLoading = () => { loader.classList.add('is-done'); main.classList.remove('is-hidden'); setTimeout(() => loader.remove(), 1100); setupReveal(); };
const tick = () => { loaded = Math.min(100, loaded + Math.ceil(Math.random() * 14)); progress.style.width = `${loaded}%`; progressNumber.textContent = loaded; if (loaded >= 100) setTimeout(finishLoading, 500); else setTimeout(tick, 180); };
window.addEventListener('load', () => setTimeout(tick, 250), { once:true });

const polaroid = $('#polaroid'), image = $('#memoryImage'), title = $('#memoryTitle'), count = $('#memoryCount'), dots = $('#carouselDots'); let current = 0, carouselTimer;
CONFIG.memories.forEach((memory, index) => { const dot = document.createElement('button'); dot.type='button'; dot.ariaLabel = `Ir a la foto ${index + 1}`; dot.addEventListener('click', () => showMemory(index)); dots.append(dot); });
function showMemory(index) { current = (index + total) % total; polaroid.classList.add('is-changing'); setTimeout(() => { const memory = CONFIG.memories[current]; image.src=memory.image; title.textContent=memory.title; count.textContent=`${String(current+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`; [...dots.children].forEach((dot, i) => dot.classList.toggle('is-active', i===current)); polaroid.classList.remove('is-changing'); }, 220); }
$('.carousel__arrow--prev').addEventListener('click', () => { showMemory(current-1); resetCarousel(); }); $('.carousel__arrow--next').addEventListener('click', () => { showMemory(current+1); resetCarousel(); }); showMemory(0);
function resetCarousel(){ clearInterval(carouselTimer); carouselTimer=setInterval(()=>showMemory(current+1),5000); } resetCarousel();
let touchStart = 0; polaroid.addEventListener('touchstart', event => touchStart=event.changedTouches[0].screenX, {passive:true}); polaroid.addEventListener('touchend', event => { const distance=event.changedTouches[0].screenX-touchStart; if(Math.abs(distance)>40) { showMemory(current+(distance<0?1:-1)); resetCarousel(); } }, {passive:true});

// Las URLs de imágenes usadas por `background-image` se resuelven desde css/style.css.
document.querySelectorAll('.section-bg').forEach(section => section.style.setProperty('--bg-image', `url("../${section.dataset.bg}")`));
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); }), { threshold:.15 });
function setupReveal(){ document.querySelectorAll('.reveal').forEach(element => observer.observe(element)); }
window.addEventListener('scroll', () => document.body.style.setProperty('--scroll-y', `${window.scrollY * .04}px`), {passive:true});

const timer = $('#timer');
function updateTimer(){ if(!CONFIG.anniversaryDate){ timer.querySelectorAll('strong').forEach((node, index) => node.textContent=index===0?'0':'00'); return; } const start = new Date(CONFIG.anniversaryDate), now = new Date(), elapsed=Math.max(0,now-start), second=1000, minute=second*60, hour=minute*60, day=hour*24; const values=[Math.floor(elapsed/day),Math.floor(elapsed%day/hour),Math.floor(elapsed%hour/minute),Math.floor(elapsed%minute/second)]; timer.querySelectorAll('strong').forEach((node,index)=>node.textContent=String(values[index]).padStart(index===0?1:2,'0')); }
updateTimer(); setInterval(updateTimer,1000);

const toast = $('#toast'); document.querySelectorAll('.funny-card').forEach(card => card.addEventListener('click', () => { toast.textContent=card.dataset.message; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),3000); })); $('#topButton').addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
