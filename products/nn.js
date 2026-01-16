class Neuron {
    constructor(inputLength, activationType = "tanh") {
        this.weights = Array(inputLength + 1).fill(0).map(() => Math.random() * 2 - 1);
        this.activationType = activationType;
        this.functions = {
            "sigmoid": { func: x => 1 / (1 + Math.exp(-x)), der: y => y * (1 - y) },
            "tanh": { func: x => Math.tanh(x), der: y => 1 - (y * y) },
            "relu": { func: x => Math.max(0, x), der: y => y > 0 ? 1 : 0 }
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
    constructor(layerSizes) {
        this.layers = []; 

        // Empezamos desde 1 porque la posición 0 son solo las entradas (sin neuronas)
        for (let i = 1; i < layerSizes.length; i++) {
            const inputCount = layerSizes[i - 1]; // Entradas que vienen de la capa anterior
            const neuronCount = layerSizes[i];    // Neuronas en la capa actual
            
            // Detectar si es la última capa para usar Sigmoid, el resto usa Tanh
            const isOutputLayer = i === layerSizes.length - 1;
            const activation = isOutputLayer ? "sigmoid" : "tanh";

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