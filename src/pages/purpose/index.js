import React, { useState, useEffect } from "react";
import { Divider, Tabs, Cascader, Checkbox } from "antd";
import moment from 'moment';
import { $, Page, Form, TablePagination, Modals, Inputs, Btn } from "../comlibs";
import Info from "./info";

const { TabPane } = Tabs;

export default function() {
  let {infoOpen, exportModal, tableList,
    verify_type_list = [
      { label: '司机', value: 'PERSON' },
      { label: '车队', value: 'COMPANY' },
      { label: '访客', value: 'VISITER' },
    ]
  }={};

  let [brandList, setBrandList]=useState([]);
  // let [modalVisible, setModalVisible]=useState(false);

  useEffect(()=>{getQuery()},[]);

  async function getQuery(){
    let brandResList = await $.get('/brand/query', {cnt_totalnum: "NO"});
    if(!brandResList.data)return;
    let list1 = brandResList.data.map((node) => {node.label = node.brand_name; node.value = node.brand_uuid; node.children = node.seriess.map((ser) => {ser.label = ser.series_name; ser.value = ser.series_uuid; return ser} ); return node})
    setBrandList(list1);
  };

  let ExportModal = () => {
		return (
			<Modals ref={(rs) => exportModal = rs}>
        <Form
          onSubmit={async (values, btn, ext) => {
            values.totalnum = "NO";
            await $.download("/export/new/truck/intention", values);
            exportModal.close()
            btn.setloading(false, 5000);
        }}
        >
          {({ set, form, submit }) => (
            <div>
              <div style={{ marginLeft: 100 }} className="mt_15">
                <span style={{display: "inline-block", width: 80}}>处理状态：</span>
                <Inputs name="process" form={form} type="radio" value='YES' radios={[
                  {text: '已处理', value: 'YES'},
                  {text: '未处理', value: 'NO'},
                ]} />
              </div>
              <div style={{ marginLeft: 100 }} className="mt_15">
                <span style={{display: "inline-block", width: 80}}>类型：</span>
                {set({
                  name: 'verify_type',
                  required: true,
                  value: parent?.banner_cover,
                },(valueSet)=>(
                  <Checkbox.Group options={verify_type_list} onChange={(checkedValues) => valueSet(checkedValues) } />
                    // <AvatarBox img_ref={ref => {img_ref = ref}} valSet={valSet} imgs={parent?.banner_cover} />
                ))}
              </div>
              <div style={{ marginLeft: 100 }} className="mt_15">
                <span style={{display: "inline-block", width: 80}}>下单日期：</span>
                <Inputs
                  name="test"
                  form={form}
                  type="rangePicker"
                  disabledDate={(current) => {return current && current > moment().endOf('day')}}
                  onSure={res => {
                    console.log(res);
                  }}
                />
              </div>
              <div className="ta_c mt_15">
                <Btn onClick={submit} />
              </div>
            </div>
          )}
        </Form>
			</Modals>
		);
  };

	let columns = [
		{
			title: "序号",
			dataIndex: "_key"
		},
		{
      title: "购车人",
      dataIndex: "material",
			render: rs => (
				<span>{rs?.name}</span>
			)
		},
		{
			title: "品牌",
			dataIndex: "brand_name"
		},
		{
			title: "车系",
			dataIndex: "series_name"
		},
		{
      title: "车型",
      dataIndex: "car_model",
		},
		{
			title: "数量",
      dataIndex: "num",
      render: rs => (
				<span>{rs}辆</span>
			)
		},
		{
			title: "操作",
			width: 170,
			align:'center',
			render: (text, record) => (
				<span>
					<a onClick={() => infoOpen.open("购车详情", record, {left: 300})}>查看</a>
					<Divider type="vertical" />
          {record.process === "YES" ? 
          <span style={{color: "#D9D9D9", fontSize: "12px"}}>标记处理</span>: 
          <a
						onClick={async () => {
							let res = await $.post("/intention/processed", {intention_uuid: record.intention_uuid});
							tableList.reload();
							$.msg("操作成功~");
							return res;
						}}
					>
						标记处理
					</a>}
				</span>
			)
		}
  ];

	return (
		<div className="br_3 bg_white pall_15">
      <Form className="mb_15" onSubmit={values => {
          values.brand_uuid = values.brandData[0];
          values.series_uuid = values.brandData[1];
          tableList.search(values)
      }}>
        {({form, set})=>(
            <div className="dis_f jc_sb">
              <div className="box">
                <div className="h_40 mr_15 dis_ib">
                  {set({
                        name: 'brandData',
                    },(valSet)=>(
                        <Cascader options={brandList} onChange={() => {
                          let _set = setTimeout(() => {
                            form._handleSubmit({});
                            clearTimeout(_set);
                          }, 50);
                      }} placeholder="全部品牌/车系" />
                    ))}
                </div>
                <div className="h_40 mr_15 dis_ib">
                    <Inputs name="process" value="" form={form} select={[
                      {value:'', text:'全部状态'},
                      {value:'YES', text:'已处理'},
                      {value:'NO', text:'未处理'},
                    ]} autoSubmit/>
                </div>
                <Btn onClick={async btn => {
                  let status = false;
                  $.store().GlobalData.user.permissions.forEach((node) => {
                    if (node.name === "购车意向") {
                      node.permissions.forEach((item) => {
                        if (item.permission_name === '导出信息' && item.permission === 'ON') {
                          status = true
                        }
                      })
                    }
                  });
                  if (status) {
                    // exportModal.open("导出购车意向")
                    await $.download("/export/new/truck/intention", {totalnum: "NO"});
                    btn.setloading(false, 5000);
                  } else {
                    return $.msg('当前账号没有导出权限')
                  }
                }}
                >导出购车意向</Btn>
              </div>
            </div>
        )}
      </Form>
      <TablePagination api="/intention/query" columns={columns} ref={(rs) => tableList = rs} />
			<Page ref={(rs) => infoOpen = rs} onClose={() => tableList.reload()}>
        <Info />
			</Page>
      <ExportModal/>
		</div>
	);
}
