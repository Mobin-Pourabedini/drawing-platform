import './header.css'
import {Button, Space, Typography, Upload, type UploadProps} from "antd";
import {Layout, Input} from "antd";
import {useState} from "react";
import {UploadOutlined} from "@ant-design/icons";
const {Header} = Layout;
const {Title} = Typography;


interface HeaderProps {
    title: string;
    setTitle: (title: string) => void;
    onExport: () => void;
    onImport: (file: File) => void;
}

export const BoardHeader: React.FC<HeaderProps> = ({title, setTitle, onExport, onImport}) => {
    const [isEditing, setIsEditing] = useState(false);

    const [tempTitle, setTempTitle] = useState(title);

    const handleSubmitTitle = () => {
        console.log(tempTitle);
        setTitle(tempTitle);
        setIsEditing(false);
    }

    const uploadProps: UploadProps = {
        accept: '.json',
        showUploadList: false,
        beforeUpload: (file) => {
            onImport(file);
            return false; // Prevent automatic upload
        },
    };

    return <Header style={{height: "50px", backgroundColor: "#2c2c2c", padding: "0 1rem"}}>
        <Space direction="horizontal" style={{float: "left"}} className="custom-ant-space">
            <Button onClick={onExport}>Export</Button>
            <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} type="default">
                    Import
                </Button>
            </Upload>
            {/*<Button onClick={onImport}>Import</Button>*/}
        </Space>
        <Space style={{float: "right"}} className="custom-ant-space">
            <div className="painting-title-div">
                {
                    isEditing ?
                    (
                        <Input className="painting-input"
                               defaultValue={title}
                               autoFocus
                               onBlur={handleSubmitTitle}
                               onPressEnter={handleSubmitTitle} onChange={(e) => setTempTitle(e.target.value)}/>
                    ) :
                    (
                        <Title level={4} className="painting-title" onClick={() => setIsEditing(true)}>{title}</Title>
                    )
                }
            </div>
        </Space>
    </Header>;
}