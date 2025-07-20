import { Layout, Typography } from 'antd';
import SchemaBuilder from './SchemaBuilder';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout style={{ minHeight: '100vh', padding: '24px' }}>
      <Header style={{ background: '#001529', color: '#fff' }}>
        <Title level={2} style={{ color: '#fff', margin: 0 }}>JSON Schema Builder</Title>
      </Header>
      <Content style={{ padding: '24px', background: '#fff' }}>
        <SchemaBuilder />
      </Content>
    </Layout>
  );
}

export default App;
