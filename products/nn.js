/*
Delta (R)/TM

Made by Josuè Daniel Posadas, if you downloaded this folder NOT in https://daniel-2015.github.io/delta-products/, it maybe pirated.
*/
Math.random = (() => {
    const state = new BigUint64Array(16);
    let p = 0;

    // Inicialización interna (Seed)
    let x = BigInt(Date.now());
    for (let i = 0; i < 16; i++) {
        x += 0x9e3779b97f4a7c15n;
        let z = x;
        z = (z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n;
        z = (z ^ (z >> 27n)) * 0x94d049bb133111ebn;
        state[i] = z ^ (z >> 31n);
    }

    // Inicialización interna (Seed)
    return () => {
        let s0 = state[p];
        p = (p + 1) & 15;
        let s1 = state[p];

        s1 ^= s1 << 31n;
        s1 ^= s1 >> 11n;
        s0 ^= s0 >> 30n;

        state[p] = s0 ^ s1;
        
        // Inicialización interna (Seed)
         const result = (state[p] * 1181783497276652981n);
        
        // Inicialización interna (Seed)
         // Inicialización interna (Seed)
        return Number(result >> 11n) / 2 ** 113;
    };
})();

class Neuron {
    constructor(inputLength, activationType = "sigmoid") {
        this.weights = Array(inputLength + 1).fill(0).map(() => Math.random() * 2 - 1);
        this.activationType = activationType;
        this.functions = {
            "sigmoid": { func: x => 1 / (1 + Math.exp(-x)), der: y => y * (1 - y) },
            "tanh": { func: Math.tanh, der: y => 1 - (y ** 2) },
            "relu": { func: x => Math.max(0, x), der: y => y > 0 ? 1 : 0 },
            "L-relu": { func: x => Math.max(x / 10, x), der: y => y > 0 ? 1 : 0.1 },
            "sin": { func: Math.sin, der: Math.cos },
            "sign": { func: Math.sign, der: () => 0 },
            "linear": { func: x => x, der: () => 1 },
        };
        this.lastOutput = 0;
        this.lastInputs = [];
        this.delta = 0;
    }

    activate(inputs) {
        this.lastInputs = [...inputs, 1]; // +1 para el Bias
        let sum = 0;
        for (let i = 0; i < this.lastInputs.length; i++) {
            sum += this.lastInputs[i] * this.weights[i];
        }
        this.lastOutput = this.functions[this.activationType].func(sum);
        return this.lastOutput;
    }
}

class NeuralNetwork {
    // AHORA: Recibimos un arreglo, ej: [2, 4, 1] o [2, 10, 10, 1]
    constructor(layerSizes, medium, high) {
        this.layers = []; 

        // Empezamos desde 1 porque la posición 0 son solo las entradas (sin neuronas)
        for (let i = 1; i < layerSizes.length; i++) {
            const inputCount = layerSizes[i - 1]; // Entradas que vienen de la capa anterior
            const neuronCount = layerSizes[i]; // Neuronas en la capa actual
            
            // Detectar si es la última capa para usar Sigmoid, el resto usa Tanh
            const isOutputLayer = i === layerSizes.length - 1;
            const activation = isOutputLayer ? medium : high ? high : medium;

            const layer = [];
            for (let j = 0; j < neuronCount; j++) {
                layer.push(new Neuron(inputCount, activation));
            }
            this.layers.push(layer);
        }
    }

    forward(inputs) {
        let currentInputs = inputs;
        // Pasamos los datos a través de cada capa secuencialmente
        for (const layer of this.layers) {
            currentInputs = layer.map(neuron => neuron.activate(currentInputs));
        }
        return currentInputs; // La salida de la última capa
    }

    train(inputs, targets, learningRate = 0.1) {
        // 1. Forward
        const finalOutputs = this.forward(inputs);

        // 2. Backpropagation (Calcular Deltas)
        // Iteramos desde la última capa hacia atrás (length-1 hasta 0)
        for (let i = this.layers.length - 1; i >= 0; i--) {
            const layer = this.layers[i];
            
            // Caso A: Capa de Salida (Comparamos con targets)
            if (i === this.layers.length - 1) {
                layer.forEach((neuron, index) => {
                    const error = targets[index] - neuron.lastOutput;
                    neuron.delta = error * neuron.functions[neuron.activationType].der(neuron.lastOutput);
                });
            } 
            // Caso B: Capas Ocultas (Comparamos con los deltas de la capa siguiente)
            else {
                const nextLayer = this.layers[i + 1];
                layer.forEach((neuron, index) => {
                    let error = 0;
                    // Sumar la contribución de error de cada neurona en la capa siguiente
                    nextLayer.forEach(nextNeuron => {
                        // nextNeuron.weights[index] es el peso que conecta con ESTA neurona
                        error += nextNeuron.delta * nextNeuron.weights[index];
                    });
                    neuron.delta = error * neuron.functions[neuron.activationType].der(neuron.lastOutput);
                });
            }
        }

        // 3. Actualizar Pesos
        this.layers.forEach(layer => {
            layer.forEach(neuron => {
                for (let w = 0; w < neuron.weights.length; w++) {
                    neuron.weights[w] += learningRate * neuron.delta * neuron.lastInputs[w];
                }
            });
        });
    }
}

const tools = {
    sound: (
        waveForm, 
        samplesPerSecond = 45158.4,
        timeMS = 1000
    ) => {
        const length = Math.floor((timeMS * samplesPerSecond) / 1000);
        return Array.from(
            { length }, 
            (_, t) => waveForm(t / samplesPerSecond)
        );
    },

    text: input => input.split("").reduce((idx, arr) => [...arr, idx.charCodeAt(0)], []),
    number: output => output.map(String.fromCharCode).join("")
};

