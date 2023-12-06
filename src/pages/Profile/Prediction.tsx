import { useEffect, useState } from 'react';
import regression, { DataPoint } from 'regression';

interface TrainingData {
    day: number;
    consumedFood: number;
}

interface PredictionResult {
    prediction: number | null;
}

interface IPredictionData {
    day: number;
    consumedFood: number;
}

interface ICatFeederPrediction {
    predictionData: IPredictionData[];
}

const trainModel = (trainingData: TrainingData[]) => {
    const data = trainingData.map(({ day, consumedFood }) => [day, consumedFood] as DataPoint);
    const result = regression.linear(data, { order: 2 });

    return (x: number) => result.predict(x)[1];
};

export default function CatFeederPrediction({ predictionData }: ICatFeederPrediction) {
    const [predictionResult, setPredictionResult] = useState<PredictionResult>({ prediction: null });

    useEffect(() => {
        // Treine o modelo usando os dados de treinamento
        const predictFunction = trainModel(predictionData);

        // Faça uma predição para o próximo dia (substitua pelo seu próprio valor)
        const nextDay = predictionData.length + 1;
        console.log(predictionData)
        const prediction = predictFunction(nextDay);

        // Atualize o estado com a predição
        setPredictionResult({ prediction });
    }, [predictionData]); // Executa apenas uma vez no início

    // ... restante do código usando predictionResult.prediction

    return <div>{predictionResult.prediction !== null ? `Próxima predição: ${predictionResult.prediction}` : 'Carregando...'}</div>;
};