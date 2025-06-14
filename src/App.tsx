import './App.css'
import {Layout, Radio, type RadioChangeEvent, Space} from 'antd'
import {EditOutlined} from '@ant-design/icons';
import {CircleIcon, SquareIcon, TriangleIcon} from '@icons/shapeIcons.tsx'
import Board from '@components/board';
import {useState} from "react";
import {Tools} from '@enums/tools.enum';

const {Content, Sider} = Layout;


function App() {
    const [selectedTool, setSelectedTool] = useState<Tools>(Tools.Pen);
    function toggleTool(e: RadioChangeEvent)  {
        setSelectedTool(e.target.value as Tools);
    }

  return (
    <Layout className="App-Layout">
        {/*<Header>This is the header</Header>*/}
        <Layout>
            <Content style={{backgroundColor: "aqua", display: "flex"}}>
                <Board selectedTool={selectedTool} />
            </Content>
            <Sider width="fit-content" className="toolbox-sider">
                <Radio.Group value={selectedTool} onChange={toggleTool}>
                    <Space direction="vertical">
                        <Radio.Button value={Tools.Pen}><EditOutlined/></Radio.Button>
                        <Radio.Button value={Tools.Triangle}><TriangleIcon/></Radio.Button>
                        <Radio.Button value={Tools.Square}><SquareIcon/></Radio.Button>
                        <Radio.Button value={Tools.Circle}><CircleIcon/></Radio.Button>
                    </Space>
                </Radio.Group>
            </Sider>
        </Layout>
        {/*<Footer>This is the footer</Footer>*/}
    </Layout>
  )
}

export default App
