import './App.css'
import {Layout, Radio, Space, RadioChangeEvent} from 'antd'
const {Content, Sider} = Layout;
import { EditOutlined } from '@ant-design/icons';
import {TriangleIcon, SquareIcon, CircleIcon} from '@icons/shapes'
import Board from '@components/board';
import React, {useState} from "react";


function App() {
    const [selectedTool, setSelectedTool] = useState<string>();

    function toggleTool(e: RadioChangeEvent)  {
        setSelectedTool(e.target.value);
        console.log('Button clicked', e.target.value);
    }

  return (
    <Layout className="App-Layout">
        {/*<Header>This is the header</Header>*/}
        <Layout>
            <Content style={{backgroundColor: "aqua", display: "flex"}}>
                <Board/>
            </Content>
            <Sider width="fit-content" className="toolbox-sider">
                <Radio.Group defaultValue="pen" onChange={toggleTool}>
                    <Space direction="vertical">
                        <Radio.Button value="pen"><EditOutlined/></Radio.Button>
                        <Radio.Button value="tri"><TriangleIcon/></Radio.Button>
                        <Radio.Button value="squ"><SquareIcon/></Radio.Button>
                        <Radio.Button value="cir"><CircleIcon/></Radio.Button>
                    </Space>
                </Radio.Group>
            </Sider>
        </Layout>
        {/*<Footer>This is the footer</Footer>*/}
    </Layout>
  )
}

export default App
