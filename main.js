const button = document.getElementById('button');
const body = document.querySelector('body');
const colorNumber = document.querySelector('.color-number');
const colorCard = document.querySelector('.color-card');
const container = document.querySelector('.container');
const title = document.querySelector('.title');


(localStorage.getItem('actual')!= null) && init()       //Sirve para que cada vez que se reinicie la pagina, no se borre el ultimo color 


function generadorColor() {          //Aca genero el Color en formato RGB 

    const numero = {
        r : Math.floor(Math.random()*255),   
        g : Math.floor(Math.random()*255),   //como Math.random genera un numero entre 0 y 1, quiero que mis numeros vayan de 0 a 255 por RGB y redondeo con Math.floor para numero entero
        b : Math.floor(Math.random()*255),  
    }
    const {r,g,b} = numero

    return {r: r, g: g, b: b};   //Exporto en forma de objeto
};

function rgbLetras(rgb) {            //Aca paso el objeto de tal manera que pueda ser leido en CSS 

    let claves = Object.values(rgb);
    let clave ={
        a : claves[0],
        b : claves[1],
        c : claves[2]
    };
    let {a,b,c}= clave;

    return `rgb(${a}, ${b}, ${c})`;
}



function setBackground() {         //Aca cambio los colores de la pagina

    const color = generadorColor();
    const newColor = rgbLetras(color);
    const texto = cerebro(color);
    
    save(color,newColor,texto)

}

function save(color,newColor,texto) {  //Para que se guarden los datos en el local storage 
    let actual = [];
    actual.push({color:color, newColor:newColor, texto:texto});

    localStorage.setItem('actual', JSON.stringify(actual));

}


 

let actual = localStorage.getItem('actual')

button.addEventListener('click',function(){
    setBackground()
    init()
} );     

function init() {
    let guardado= JSON.parse(localStorage.getItem('actual'))
    let newColo=guardado[0].newColor;
    let text=guardado[0].texto;


    colorNumber.innerHTML=newColo;

    title.setAttribute('style', `color: ${newColo};`);
    colorNumber.setAttribute('style', `color: ${newColo};`);
    button.setAttribute('style', `background-color: ${newColo};`);
    body.setAttribute('style', `background-color: ${newColo};`);
    colorCard.setAttribute('style', `background-color: ${newColo};`);


    if (text==='light'){
        container.setAttribute('style', 'background: rgba(7, 15, 23, 0.65);');
        button.style.color='rgba(7, 15, 23, 0.65)';
    } else {
        container.setAttribute('style', 'background: rgba(255, 255, 255, 0.8);');
        button.style.color='rgba(255, 255, 255, 0.8)';
    }
}

//---------------------MACHINE LEARNING-----------------------------------------

function colorCerebro(x) {                 //Aca paso los valores rgb que van de 0 a 255 y los pongo de 0 a 1 porque la libreria brain.js solo entiende con esos valores

    let claves = Object.values(x)
    let clave ={
        a : claves[0]/255,
        b : claves[1]/255,
        c : claves[2]/255
    };
    let {a,b,c}= clave;
    
    return {r: a, g: b, b: c};
}


function cerebro(color) {               //Aca la funcion me va a decir si el color es claro u oscuro

    let colorCer =colorCerebro(color);
    
    fetch('./data.json')
    .then((response) => response.json())
    .then((data) => {

        // const network = new brain.NeuralNetwork();
        const network = new brain.recurrent.LSTM();

        const trainingData = data.map(item => ({
                input: item.input,
                output:item.output
            }))
            console.log(trainingData)
            network.train(trainingData)                                                     //Entrenamos a la maquina, mientras mas ejemplos le demos, mejores van a ser los resultados
            const result = brain.likely(colorCer, network);
            return result;
        })
        
        


    
}