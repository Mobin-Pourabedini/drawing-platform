import './App.css'
import {Button, Form, Input, Layout, message, Modal, type RadioChangeEvent, Space} from 'antd'
import Board from '@components/board';
import {useEffect, useState} from "react";
import {Tools} from '@enums/tools.enum';
import {BoardHeader} from "@components/Header/header.tsx";
import {BoardToolBox} from "@components/ToolBox/toolbox.tsx";
import {CircleIcon, SquareIcon, TriangleIcon} from '@icons/shapeIcons'
import type {shape} from './components/board.tsx';
import {ShapeTypes} from "@enums/shapes.enum.ts";
import {apiClient, clearToken, setToken} from "./utils/apiClient.ts";

const {Content, Footer} = Layout;

interface ExportData {
    title: string
    shapes: shape[]
    paths: string[]
}


function App() {
    const [paths, setPaths] = useState<string[]>([]);
    const [shapes, setShapes] = useState<shape[]>([]);
    const [selectedTool, setSelectedTool] = useState<Tools>(Tools.Pen);
    const [title, setTitle] = useState<string>('click to change title');
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [loginVisible, setLoginVisible] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);


    useEffect(() => {
        const t = localStorage.getItem('jwt_token');
        if (t) {
            setIsLoggedIn(true);
            handleLoadBoard().then(
                () => {
                    console.log("Loaded board");
                }
            )
        }
    }, [isLoggedIn]);


    function toggleTool(e: RadioChangeEvent)  {
        setSelectedTool(e.target.value as Tools);
    }

    async function handleLogin(username: string, password: string){
        try {
            const resp = await apiClient.post("/api/auth/login", {username, password});
            const token = resp.data.access_token;
            setToken(token)
            setIsLoggedIn(true)
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async function handleLogout(){
        clearToken()
        clearBoard()
        setIsLoggedIn(false)
    }

    const onFinishLogin = async (values: {username: string, password: string}) => {
        setLoginLoading(true);
        try {
            await handleLogin(values.username, values.password);
            message.success('Welcome back!');
            setLoginVisible(false);
        } catch {
            message.error('Login failed. Check your credentials.');
        } finally {
            setLoginLoading(false);
        }
    };

    function clearBoard(){
        setShapes([])
        setPaths([])
        setTitle('click to change title')
    }

    function serializeBoard(): string {
        const exportData: ExportData = {
            title: title,
            shapes: shapes,
            paths: paths,
        };

        return JSON.stringify(exportData, null, 2);
    }

    function loadBoardFromSerialization(dataStr: string) {
        try {
            const importData: ExportData = JSON.parse(dataStr);
            console.log(importData);
            setPaths(importData.paths);
            setTitle(importData.title);
            setShapes(importData.shapes);
        } catch (e) {
            console.error(e);
        }
    }

    async function handleSaveBoard() {
        const dataStr: string = serializeBoard()
        try {
            await apiClient.post("/api/painting/save", {canvas_data: dataStr});
        } catch (e) {
            console.error(e);
        }
    }

    async function handleLoadBoard() {
        try {
            const resp = await apiClient.get("/api/painting/my");
            console.log(resp.data.canvas_data);
            loadBoardFromSerialization(resp.data.canvas_data);
        } catch(e) {
            console.error(e);
        }
    }

    function handleExport() {
        const dataStr = serializeBoard();
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${title}.json`;
        link.click();

        URL.revokeObjectURL(url);
    }

    function handleImport(file: File) {
        const reader = new FileReader();
        reader.onload = (e) => {
            loadBoardFromSerialization(e.target?.result as string)
        };
        reader.readAsText(file);
    }


  return (
      <><Layout className="App-Layout">
          <BoardHeader
              setTitle={setTitle}
              title={title}
              onExport={handleExport}
              onImport={handleImport}
              isLoggedIn={isLoggedIn}
              onLogin={() => {setLoginVisible(true)}}
              onLogout={handleLogout}
              onSave={handleSaveBoard}
          />
          <Layout>
              <Layout>
                  <Content style={{display: "flex"}}>
                      <Board selectedTool={selectedTool} shapes={shapes} setShapes={setShapes} paths={paths}
                             setPaths={setPaths}/>
                  </Content>
                  <Footer>
                      <Space direction="horizontal" style={{columnGap: "200px"}}>
                          <Space>
                              <CircleIcon/>
                              {shapes.reduce((acc, val) => acc + (val.kind == ShapeTypes.Circle ? 1 : 0), 0)}
                          </Space>
                          <Space>
                              <TriangleIcon/>
                              {shapes.reduce((acc, val) => acc + (val.kind == ShapeTypes.Triangle ? 1 : 0), 0)}
                          </Space>
                          <Space>
                              <SquareIcon/>
                              {shapes.reduce((acc, val) => acc + (val.kind == ShapeTypes.Square ? 1 : 0), 0)}
                          </Space>
                      </Space>
                  </Footer>
              </Layout>
              <BoardToolBox value={selectedTool} onChange={toggleTool}/>
          </Layout>
      </Layout>
      <Modal
          title="Login"
          open={loginVisible}
          footer={null}
          onCancel={() => setLoginVisible(false)}
      >
          <Form
              name="loginForm"
              initialValues={{remember: true}}
              onFinish={onFinishLogin}
              layout="vertical"
          >
              <Form.Item
                  label="Username"
                  name="username"
                  rules={[{required: true, message: 'Please input your username!'}]}
              >
                  <Input autoComplete="username"/>
              </Form.Item>

              <Form.Item
                  label="Password"
                  name="password"
                  rules={[{required: true, message: 'Please input your password!'}]}
              >
                  <Input.Password autoComplete="current-password"/>
              </Form.Item>

              <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loginLoading}>
                      Submit
                  </Button>
              </Form.Item>
          </Form>
      </Modal></>
  )
}

export default App
