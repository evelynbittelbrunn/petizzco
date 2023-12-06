import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Avatar, Button, Form, Input } from "antd";
import "./Login.css"

export default function Login() {
    const [form] = Form.useForm();

    function handleSubmit(data: any) {
        console.log(data);
    }

    return (
        <div className="container-login">
            <div className="card-login">
                <Avatar size={145} className="login-avatar" src="https://media.discordapp.net/attachments/871403676495917120/1181832612545843282/Gato.png?ex=65827e64&is=65700964&hm=9494bd6a503ab7169ea8c2e9f661b1c5185f3ec5044b6ca67f73943e4336beb9&=&format=webp&quality=lossless&width=580&height=580" />
                <Form
                    form={form}
                    name="new-account-form"
                    onFinish={(data) => {
                        handleSubmit(data)
                    }}
                    layout="vertical"
                    requiredMark={false}
                >
                    <Form.Item
                        name="login"
                        label="Login"
                        rules={[{ required: true, message: "Preencha esse campo" }]}
                    >
                        <Input placeholder="Login" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Senha"
                        rules={[{ required: true, message: "Preencha esse campo" }]}
                    >
                        <Input.Password
                            placeholder="Senha super secreta"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>
                    <Button
                        type="default"
                        htmlType="submit"
                        className="submit-button-login"
                    >
                        Entrar
                    </Button>
                </Form>
            </div >
        </div>
    );
}