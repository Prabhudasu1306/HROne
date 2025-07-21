import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Input, Button, Select, Card, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

function Field({ name, control, register, watch, setValue }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${name}.fields`,
  });

  return (
    <>
      {fields.map((field, index) => {
        const currentName = `${name}.fields.${index}`;
        const type = watch(`${currentName}.type`);

        return (
          <Card key={field.id || index} style={{ marginBottom: '16px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {/* Field Name */}
              <Controller
                name={`${currentName}.name`}
                control={control}
                defaultValue={field.name}
                render={({ field }) => (
                  <Input
                    placeholder="Field Name"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />

              {/* Field Type */}
              <Controller
                name={`${currentName}.type`}
                control={control}
                defaultValue={field.type ?? ''}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      if (
                        value === 'nested' &&
                        !watch(`${currentName}.fields`)
                      ) {
                        setValue(`${currentName}.fields`, [
                          { name: '', type: '' },
                        ]);
                      }
                    }}
                    placeholder="Select Type"
                    style={{ width: '100%' }}
                  >
                    <Option value="string">String</Option>
                    <Option value="number">Number</Option>
                    <Option value="nested">Nested</Option>
                  </Select>
                )}
              />

              {/* Delete Button */}
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => remove(index)}
              >
                Delete Field
              </Button>

              {/* Nested Field */}
              {type === 'nested' && (
                <div
                  style={{
                    paddingLeft: '20px',
                    borderLeft: '2px dashed #aaa',
                  }}
                >
                  <Field
                    name={`${currentName}`}
                    control={control}
                    register={register}
                    watch={watch}
                    setValue={setValue}
                  />
                </div>
              )}
            </Space>
          </Card>
        );
      })}

      <Button
        type="dashed"
        onClick={() => append({ name: '', type: '' })}
        icon={<PlusOutlined />}
        block
        style={{ marginBottom: '1rem' }}
      >
        Add Field
      </Button>
    </>
  );
}

function SchemaBuilder() {
  const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      root: {
        fields: [{ name: '', type: '' }],
      },
    },
  });

  const onSubmit = (data) => {
    // Optional cleanup: remove fields with missing name/type
    const cleanFields = (fields) =>
      fields
        .filter((f) => f.name && f.type)
        .map((f) =>
          f.type === 'nested'
            ? { ...f, fields: cleanFields(f.fields || []) }
            : f
        );

    const cleanData = {
      fields: cleanFields(data.root.fields),
    };

    console.log('Final JSON Schema:', JSON.stringify(cleanData, null, 2));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Dynamic JSON Schema Builder</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="root"
          control={control}
          register={register}
          watch={watch}
          setValue={setValue}
        />

        <Button type="primary" htmlType="submit" style={{ marginTop: '20px' }}>
          Generate JSON
        </Button>

        <pre
          style={{
            marginTop: '20px',
            background: '#f9f9f9',
            padding: '10px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {JSON.stringify(watch('root'), null, 2)}
        </pre>
      </form>
    </div>
  );
}

export default SchemaBuilder;
