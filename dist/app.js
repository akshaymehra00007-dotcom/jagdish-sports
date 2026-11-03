const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduced&&'IntersectionObserver' in window){document.documentElement.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=`${el.closest('.pillars')?(i%3)*80:0}ms`;observer.observe(el)})}
const menu=document.querySelector('.menu'),nav=document.querySelector('nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');menu.textContent=open?'×':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');menu.textContent='☰'}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'}});
const lightbox=document.querySelector('#lightbox');document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{lightbox.querySelector('img').src=button.dataset.photo;lightbox.querySelector('img').alt=button.dataset.caption;lightbox.querySelector('p').textContent=button.dataset.caption;lightbox.showModal()}));lightbox.querySelector('.close').addEventListener('click',()=>lightbox.close());lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close()});
let ticking=false;addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{document.querySelector('.scroll-progress').style.width=`${scrollY/(document.documentElement.scrollHeight-innerHeight)*100}%`;ticking=false});ticking=true}},{passive:true});document.querySelector('#year').textContent=new Date().getFullYear();
const enquiryForm=document.querySelector('#enquiry-form');
function prepareEnquiry(){
  const name=document.querySelector('#enquiry-name').value.trim();
  const phone=document.querySelector('#enquiry-phone').value.trim();
  const interest=document.querySelector('#enquiry-interest').value;
  const message=document.querySelector('#enquiry-message').value.trim();
  document.querySelector('#enquiry-text').value=`Hello Jagdish Sports Academy,\n\nName: ${name}\nMobile: ${phone}\nEnquiry: ${interest}${message?`\nMessage: ${message}`:''}\n\nPlease share the relevant training details. Thank you.`;
}
enquiryForm.addEventListener('input',()=>{document.querySelector('#enquiry-name').setCustomValidity('');document.querySelector('#enquiry-status').textContent='';prepareEnquiry()});
enquiryForm.addEventListener('change',prepareEnquiry);
enquiryForm.addEventListener('submit',event=>{
  const name=document.querySelector('#enquiry-name');
  if(name.value.trim().length<2){event.preventDefault();name.setCustomValidity('Please enter your name using at least two characters.');name.reportValidity();return;}
  prepareEnquiry();
  document.querySelector('#enquiry-status').textContent='Continue in WhatsApp and tap Send to deliver your enquiry. If the new tab did not open, allow pop-ups or call the academy.';
});
