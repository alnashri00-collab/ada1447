
const webAppUrl = "https://script.google.com/macros/s/AKfycbwkZXIsc7cUx5vauxuky2JtJYni0GojoaqUTFeQ2x2A7VHCD1x77_XX3sR9draMAbQzwA/exec";

const fileIcons = {
  'pdf':'https://cdn-icons-png.flaticon.com/512/337/337946.png',
  'jpg':'https://cdn-icons-png.flaticon.com/512/136/136524.png',
  'jpeg':'https://cdn-icons-png.flaticon.com/512/136/136524.png',
  'png':'https://cdn-icons-png.flaticon.com/512/136/136524.png',
  'doc':'https://cdn-icons-png.flaticon.com/512/136/136539.png',
  'docx':'https://cdn-icons-png.flaticon.com/512/136/136539.png',
  'ppt':'https://cdn-icons-png.flaticon.com/512/136/136542.png',
  'pptx':'https://cdn-icons-png.flaticon.com/512/136/136542.png',
  'xls':'https://cdn-icons-png.flaticon.com/512/136/136538.png',
  'xlsx':'https://cdn-icons-png.flaticon.com/512/136/136538.png',
  'default':'https://cdn-icons-png.flaticon.com/512/136/136523.png'
};

const container = document.getElementById('container');

fetch(webAppUrl)
  .then(res => res.json())
  .then(data => {
    Object.keys(data).forEach(key => {
      const elem = data[key];
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<h2>${elem.title} (${elem.weight})</h2>
        <p class="examples"><strong>أمثلة على تحقق العنصر:</strong> ${elem.examples.join('، ')}</p>
        <div class="files"><strong>الشواهد:</strong><br></div>`;
      const filesDiv = card.querySelector('.files');
      elem.files.forEach((file, idx) => {
        const ext = file.name.split('.').pop().toLowerCase();
        const icon = fileIcons[ext] || fileIcons['default'];
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" class="fileCheckbox" data-url="${file.url}" data-ext="${ext}"> ${file.name} <img class="icon" src="${icon}" />`;
        label.querySelector('input').addEventListener('click', (e)=>{
          const url = e.target.dataset.url;
          if(['pdf','jpg','jpeg','png'].includes(ext)){
            openLightbox(url);
          } else { window.open(url,'_blank'); }
        });
        filesDiv.appendChild(label);
      });
      container.appendChild(card);
    });
  });

function openLightbox(url){
  const lb = document.getElementById('lightbox');
  const iframe = document.getElementById('lightboxFrame');
  iframe.src = url;
  lb.style.display = 'flex';
}

document.querySelector('.close').addEventListener('click', ()=>{
  const lb = document.getElementById('lightbox');
  const iframe = document.getElementById('lightboxFrame');
  iframe.src='';
  lb.style.display='none';
});

document.getElementById('printBtn').addEventListener('click', ()=>{
  const selected = document.querySelectorAll('.fileCheckbox:checked');
  if(selected.length===0){ alert('اختر شواهد للطباعة'); return; }
  const printWindow = window.open('','','width=900,height=700');
  let html = `<html><head><title>طباعة الشواهد</title>
  <style>
    body{font-family:Arial;margin:20px;}
    h2{color:#4a90e2;}
    .file{margin-bottom:10px;}
    iframe{width:100%;height:400px;border:1px solid #ccc;margin-bottom:15px;}
    img{max-width:100%;height:auto;margin-bottom:15px;}
    @page{size:A4;margin:20mm;}
  </style></head><body><div id="printContainer">`;
  selected.forEach(input=>{
    const url=input.dataset.url; const ext=input.dataset.ext;
    html+=`<div class="file"><strong>${input.parentElement.textContent.trim()}</strong><br>`;
    if(['jpg','jpeg','png'].includes(ext)){ html+=`<img src="${url}" />`; }
    else if(ext==='pdf'){ html+=`<iframe src="${url}"></iframe>`; }
    else{ html+=`<a href="${url}" target="_blank">فتح الملف ${input.parentElement.textContent.trim()}</a>`; }
    html+=`</div>`;
  });
  html+=`</div></body></html>`;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
});
