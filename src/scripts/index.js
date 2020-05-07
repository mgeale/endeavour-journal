import '../styles/style.css';
import data from '../journal-entries/endeavour-journal.json';
import Globe from '../scripts/globe';

const start = () => {
    var container = document.createElement('div');
    container.id = 'container';
    document.body.appendChild(container);

    var info = document.createElement('div');
    info.id = 'info';
    info.innerHTML = `<strong><a href="http://www.chromeexperiments.com/globe">WebGL Globe</a></strong>
        <span class="bull">&bull;</span>
        Created by <a href="https://twitter.com/mgeale">Matthew Geale</a>
        <span class="bull">&bull;</span>
        Data acquired from <a href="https://catalogue.nla.gov.au/Record/3525402">National Library of Australia</a>
        <span class="bull">&bull;</span>
        Starfield from <a href="http://labs.gmtaz.com/quake/">GMTAZ.com</a>
        <span class="bull">&bull;</span>
        Earth map from <a href="http://orbitingeden.com/orrery/soloearth.html">Orbiting Eden</a>`;
    document.body.appendChild(info);

    var title = document.createElement('div');
    title.id = 'title';
    title.innerHTML = `HMS Endeavour, 1768 to 1771`;
    document.body.appendChild(title);

    var ce = document.createElement('a');
    ce.id = 'ce';
    ce.href = 'http://www.chromeexperiments.com/globe';
    ce.innerHTML = `<span>This is a Chrome Experiment</span>`;
    document.body.appendChild(ce);

    var container = document.getElementById('container');
    var globe = new Globe(container);

    console.log(globe);

    window.data = data;
    var coordinates = [];
    for (let i = 0; i < data.length; i++) {
        coordinates.push(data[i].coordinates.latitude, data[i].coordinates.longitude, 0.01);
    }
    globe.addData(coordinates, { format: 'magnitude', animated: true })
    globe.createPoints();
    globe.animate();
};

start();