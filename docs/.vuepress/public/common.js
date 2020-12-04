window.addEventListener('click', (e) => {
  const span = document.createElement('span');
  span.setAttribute('class', 'click-span');
  span.innerText = 'Jerry的博客';

  const r = Math.floor( Math.random() * 256 );
  const g = Math.floor( Math.random() * 256 );    
  const b = Math.floor( Math.random() * 256 );

  span.style.left = e.clientX + 'px';
  span.style.top = e.clientY + 'px';
  span.style.color = `rgba(${r}, ${g}, ${b})`;
  document.body.appendChild(span);
  const time = setTimeout(() => {
    document.body.removeChild(span);
    clearTimeout(time);
  }, 2000);
});
