function tab(n) {
    document.getElementById('ttl').innerText = n;
    document.getElementById('on').src = `sources/loading${Math.floor(Math.random() * 2 + 1)}.html`;
    document.getElementsByClassName('window')[0].style.display = 'block';
    setTimeout(() => document.getElementById('on').src = `sources/${n}.html`, 1000);
    
}
function web(n) {
    document.getElementById('ttl').innerText = n;
    document.getElementById('on').src = `sources/loading${Math.floor(Math.random() * 2 + 1)}.html`;
    document.getElementsByClassName('window')[0].style.display = 'block';
    setTimeout(() => document.getElementById('on').src = n, 1000);
}
