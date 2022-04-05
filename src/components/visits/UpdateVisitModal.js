import React from "react";
import "antd/dist/antd.css";
import { Modal, Typography, notification, Form, Card, Row, Col, Avatar, Input} from "antd";
import { EditOutlined, CalendarOutlined} from "@ant-design/icons";
import axios from '../../axiosApi';

const { Title } = Typography;

function UpdateVisitModal({getAllVisit, setLoading, ...record}) {
  const [form] = Form.useForm();
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const onUpdate = async(values, id) => {
    console.log(values);
    await axios.patch(`api/visit/${id}`, values).then(response=>{
      setLoading(true);
      console.log(response.data);
      
      notification.success({ message: 'Sėkmingai atnaujinta!' });
      setVisible(false);
      getAllVisit();
    })
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = (values, id) => {
    setConfirmLoading(true);
    setTimeout(() => {
      onUpdate(values, id);
      setVisible(false);
      setConfirmLoading(false);
    }, 2000);
  };

  return (
    <>
      <EditOutlined onClick={showModal} style={{ color: "#08c",  fontSize: '150%'}}/>

      <Modal
        centered
        style={{ height: "80%" }}
        bodyStyle={{ height: "100%", overflowY: "auto", padding: 0 }}
        visible={visible}
        onCancel={handleCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              console.log(values)
              handleOk(values, record.visit_id);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
        confirmLoading={confirmLoading}
        cancelText="Atšaukti"
        okText="Atnaujinti"
        mask={true}
        maskClosable={false}
        destroyOnClose={true}
        title={<Title level={4}>Atnaujinti vizitą</Title>}
      >
        <Card bordered={false} size="small" style={{ padding: 15 }}>
        <Form form={form} layout="vertical"
          initialValues={{
            description: record.description,
        }}>
          
          <Row>
            <Col span={6}>
              <Avatar shape="square" size={100} icon={<CalendarOutlined />} />
            </Col>
            <Col span={18}>
            <Form.Item
                label="Aprašymas:"
                rules={[{ required: true }]}
                style={{ width: "100%" }}
                name="description">
                <Input.TextArea showCount maxLength={2000} placeholder="Aprašymas" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      </Modal>
    </>
  );
};

export default UpdateVisitModal;