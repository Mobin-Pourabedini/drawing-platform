import {Tools} from "@enums/tools.enum.ts";
import {Radio, type RadioChangeEvent, Space} from "antd";
import {EditOutlined, SelectOutlined} from "@ant-design/icons";
import {CircleIcon, SquareIcon, TriangleIcon} from "@icons/shapeIcons.tsx";
import {Layout} from 'antd'
const {Sider} = Layout;

export function BoardToolBox(props: { value: Tools, onChange: (e: RadioChangeEvent) => void }) {
    return <Sider width="fit-content" className="toolbox-sider">
        <Radio.Group value={props.value} onChange={props.onChange}>
            <Space direction="vertical">
                <Radio.Button value={Tools.Select}><SelectOutlined/></Radio.Button>
                <Radio.Button value={Tools.Pen}><EditOutlined/></Radio.Button>
                <Radio.Button value={Tools.Triangle}><TriangleIcon/></Radio.Button>
                <Radio.Button value={Tools.Square}><SquareIcon/></Radio.Button>
                <Radio.Button value={Tools.Circle}><CircleIcon/></Radio.Button>
            </Space>
        </Radio.Group>
    </Sider>;
}