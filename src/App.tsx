import './App.css'
import {Layout, type RadioChangeEvent, Space} from 'antd'
import Board from '@components/board';
import {useState} from "react";
import {Tools} from '@enums/tools.enum';
import {BoardHeader} from "@components/Header/header.tsx";
import {BoardToolBox} from "@components/ToolBox/toolbox.tsx";
import {CircleIcon, SquareIcon, TriangleIcon} from '@icons/shapeIcons'
import type {shape} from './components/board.tsx';
import {ShapeTypes} from "@enums/shapes.enum.ts";

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
    function toggleTool(e: RadioChangeEvent)  {
        setSelectedTool(e.target.value as Tools);
    }

    function handleExport() {
        const exportData: ExportData = {
            title: title,
            shapes: shapes,
            paths: paths,
        };

        const dataStr = JSON.stringify(exportData, null, 2);
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
            try {
                const importData: ExportData = JSON.parse(e.target?.result as string);
                const newShapes = importData.shapes || [];
                const newPaths = importData.paths || [];
                const newTitle = importData.title || 'click to change title';
                setShapes(newShapes);
                setPaths(newPaths);
                setTitle(newTitle);
            } catch (error) {
                console.error('خطا در وارد کردن فایل:', error);
                // You could add a notification here
            }
        };
        reader.readAsText(file);
    }


  return (
    <Layout className="App-Layout">
        <BoardHeader setTitle={setTitle} title={title} onExport={handleExport} onImport={handleImport}/>
        <Layout>
            <Layout>
                <Content style={{display: "flex"}}>
                    <Board selectedTool={selectedTool} shapes={shapes} setShapes={setShapes} paths={paths} setPaths={setPaths}/>
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
  )
}

export default App
