import { Avatar, Button, Input, TimePicker, Form } from "antd";
import { LogoutOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import NumericInput from "../../components/NumericInput/NumericInput";
import axios from 'axios';
import moment from 'moment';
import "./Profile.css"
import CatFeederPrediction from "./Prediction";

interface OriginalRecord {
    id: number;
    dateTime: string;
    grams: number;
}

interface DailyTotal {
    firstGrams: number;
    lastGrams: number;
}

interface ResultRecord {
    day: number;
    consumedFood: number;
}

export default function Profile() {
    const format = 'h:mm A';
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [schedules, setSchedules] = useState([]);
    const [predictionData, setPredictionData] = useState([]);
    const [infoForm] = Form.useForm();
    const [scheduleForm] = Form.useForm();
    const [isFetchingSchedules, setIsFetchingSchedules] = useState(true);


    const schedule1 = Form.useWatch('schedule1', scheduleForm);

    console.log(predictionData);

    useEffect(() => {
        fetchSchedules();
        fetchCurrentQuantity();
    }, []);

    // useEffect(() => {
    //     if (schedules.length === 0) return;
    //     // console.log(dayjs(schedules[0], format));
    //     console.log(dayjs('12:08', format));
    //     console.log(dayjs(schedules[0], format));
    //     scheduleForm.setFieldsValue({
    //         // schedule1: schedules[0],
    //         // schedule2: schedules[1],
    //         // schedule3: schedules[2],
    //     });
    // }, [isFetchingSchedules]);

    const fetchSchedules = async () => {
        try {
            const response = await axios.get('https://betinho-service.onrender.com/scheduledTime/getAll?token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.XkioJmy3Ta-mgTotFxqUzZfG4xP73ycm-4kTIxUpM9o');

            if (response.status === 200) {
                if (response.data) {
                    const newFormat = response.data.map((scheduled: any) => {
                        const scheduleFormatted = moment(scheduled.time, 'HH:mm:ss').format('HH:mm');
                        return scheduleFormatted;
                    });
                    setSchedules(newFormat);
                    setIsFetchingSchedules(false);
                } else {
                    console.error('Dados inválidos no corpo da resposta.');
                }
            } else {
                console.error('Erro ao buscar dados:', response.status, response.statusText);
            }
        } catch (erro) {
            console.error('Erro na requisição:', erro);
        }
    };

    const fetchCurrentQuantity = async () => {
        try {
            const response = await axios.get('https://betinho-service.onrender.com/currentQuantity');

            if (response.status === 200) {
                if (response.data) {
                    const newArray = transformArray(response.data);
                    console.log(newArray)
                    setPredictionData(newArray);
                } else {
                    console.error('Dados inválidos no corpo da resposta.');
                }
            } else {
                console.error('Erro ao buscar dados:', response.status, response.statusText);
            }
        } catch (erro) {
            console.error('Erro na requisição:', erro);
        }
    };

    function handleSubmit(data: any) {
        console.log(data);
    }

    function onChangeSchedules(data: any) {
        console.log(data);
        // console.log(data[0].toDate())
        // console.log(moment(data[0].value).format('HH:mm'));

        const momentTime = moment(data[0]);
        console.log(momentTime)
        console.log(dayjs(data[0]));
    }

    function calculateConsumedFood(records: any) {
        const firstRecord = records[0];
        const lastRecord = records[records.length - 1];
        return firstRecord.grams - lastRecord.grams;
    }

    function transformArray(originalArray: any) {
        const resultArray: any = [];
        const groupedByDay = originalArray.reduce((acc: any, record: any) => {
            const date = record.dateTime.split('T')[0];
            acc[date] = acc[date] || [];
            acc[date].push(record);
            return acc;
        }, {});

        Object.keys(groupedByDay).forEach((date, index) => {
            const consumedFood = calculateConsumedFood(groupedByDay[date]);
            resultArray.push({ day: index + 1, consumedFood });
        });

        return resultArray;
    }


    return (
        <div className="container">
            <nav id="nav">
                <img src="/images/logo.png" alt="Logo Petizzco" />
                <Button type="text" icon={<LogoutOutlined size={20} />} />
            </nav>
            <div className="card-info">
                <div className="card-info-container">
                    <Avatar size={145} className="profile-avatar" src="https://media.discordapp.net/attachments/871403676495917120/1181403144173928518/banho-em-gato-angora-valor.png?ex=6580ee6a&is=656e796a&hm=c3905b972404d6a48387533c46539b910192ccd65b027d6da77a7ab1f06ab678&=&format=webp&quality=lossless&width=580&height=580" />
                    <div className="card-content">
                        <div className="kitty-info">
                            <Form
                                form={infoForm}
                                name="new-account-form"
                                onFinish={(data) => {
                                    handleSubmit(data)
                                }}
                                layout="vertical"
                                requiredMark={false}
                            >
                                <Form.Item
                                    name="kitty-name"
                                    label="Nome"
                                    rules={[{ required: true, message: "Preencha esse campo" }]}
                                >
                                    <Input placeholder="Nome do mini querido" />
                                </Form.Item>
                                <div className="numeric-input-info">
                                    <Form.Item
                                        name="kitty-age"
                                        label="Idade"
                                        rules={[{ required: true, message: "Preencha esse campo" }]}
                                    >
                                        <NumericInput style={{ width: 120 }} value={age} onChange={setAge} />
                                    </Form.Item>
                                    <Form.Item
                                        name="kitty-weight"
                                        label="Peso"
                                        rules={[{ required: true, message: "Preencha esse campo" }]}
                                    >
                                        <NumericInput style={{ width: 120 }} value={weight} onChange={setWeight} />
                                    </Form.Item>
                                    <Button
                                        type="default"
                                        htmlType="submit"
                                        className="submit-button-profile"
                                    >
                                        Salvar
                                    </Button>
                                </div>
                            </Form>
                        </div>
                        <div className="schedules-info">
                            <label>Horários de Hoje</label>
                            <Form
                                form={scheduleForm}
                                name="new-account-form"
                                layout="vertical"
                                requiredMark={false}
                                onFieldsChange={(_, allFields) => {
                                    onChangeSchedules(allFields);
                                }}
                            >
                                <div className="schedules-input-info">
                                    <Form.Item
                                        name="schedule1"
                                        rules={[{ required: true, message: "Preencha esse campo" }]}
                                    >
                                        <TimePicker format="HH:mm" style={{ width: 120 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="schedule2"
                                        rules={[{ required: true, message: "Preencha esse campo" }]}
                                    >
                                        <TimePicker format={format} style={{ width: 120 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="schedule3"
                                        rules={[{ required: true, message: "Preencha esse campo" }]}
                                    >
                                        <TimePicker value={schedules[0]} format={format} style={{ width: 120 }} />
                                    </Form.Item>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
            <CatFeederPrediction predictionData={predictionData} />
        </div >
    )
}