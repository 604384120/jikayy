import React, { useState, useEffect } from 'react';
import { Divider, Table } from "antd";
import { $, Form, Modals, Inputs, Btn } from "../comlibs";

export default function() {
  let {addBrand, series, tempCat1}={};
  let [tablelist, setTableList]=useState([]);
  let [limit, setLimit]=useState(10);
  let [page, setPage]=useState(1);
  let [total, setTotal]=useState(0);

  useEffect(()=>{getList()},[])

  async function getList(pag, pageSize){
    let res= await $.get('/truck/cat1/query', {page: pag ? pag : 1, limit});
    if(!res.category)return;
    let list = res.category.map((node) => {node.children = node.cat2s; return node});
    setTableList(list);
    setTotal(res.totalnum);
    pag && setPage(pag);
  };

  async function deleteData(record){
    await $.get('/truck/cat2/remove',{cat1: tempCat1, cat2: record.cat2});
    $.msg("操作成功~");
    getList();
  };

	let BrandModal = () => {
		return (
			<Modals ref={(rs) => addBrand = rs}>
        {(props) => {
          let set = props.type === "set" ? "set" : null;
          return (
            <Form
            action={set ? "/truck/cat1/update" : "/truck/cat1/add"}
            params={{
              cat1: props?.cat1 ? props?.cat1 : undefined
            }}
            method="POST"
            success={() => {
              set ? $.msg("大类修改成功") : $.msg("大类添加成功");
              addBrand.close();
              getList();
            }}
          >
            {({ form, set, submit }) => (
              <div>
                <div style={{ marginLeft: 150 }} className="mt_15">
                    <Inputs
                      className="input_wrap"
                      form={form}
                      name="name"
                      value={props.name1}
                      required={set ? false : true}
                      placeholder="请输入大类名称"
                    />
                  </div>
                <div className="ta_c mt_15">
                  <Btn onClick={submit} />
                </div>
              </div>
            )}
          </Form>
          )}
        }
			</Modals>
		);
  };
  
	let SeriesModal = () => {
		return (
			<Modals ref={(rs) => series = rs}>
				{(props) => {
          let set = props.type === "set" ? "set" : null;
					return <Form
            onSubmit={async (values, btn, ext) => {
              values.cat1 = props?.cat1
              values.cat2 = props?.cat2
              let rs = await $.post(set ? "/truck/cat2/update" : "/truck/cat2/add", {...values});
              set ? $.msg("子类修改成功") : $.msg("子类添加成功");
              series.close();
              btn.loading = false;  //关闭提交按钮loading加载状态
              getList();
          }}
					>
						{({ form, set, submit }) => (
							<div>
								<div style={{ marginLeft: 150 }} className="mt_15">
                  {/* 车系名称： */}
									<Inputs
										className="input_wrap"
										form={form}
                    name="name"
                    value={props?.name2}
										required={set ? false : true}
										placeholder="请输入子类名称"
									/>
								</div>
								<div className="ta_c mt_15">
									<Btn onClick={submit} />
								</div>
							</div>
						)}
					</Form>
				}}
			</Modals>
		);
  };

  let columns=[
    	{
			title: "大类",
			dataIndex: "name1"
		},
		{
      title: "子类",
      dataIndex: "name2",
			render: (text, record) => {
        if (text) {
          return text
        } else {
          return <span>-</span>
        }
      }
    },
    	{
			title: "操作",
			width: 220,
			align:'center',
			render: (text, record) => {
        if (text.cat1) {
          tempCat1 = text.cat1
        }
        if (record.children) {
          return (<span>
            <a onClick={() => series.open("子类", {...record, type: "add"})}>添加子类</a>
            <Divider type="vertical" />
            <a onClick={() => addBrand.open("修改大类", {...record, type: "set"})}>修改</a>
            <Divider type="vertical" />
            <a
              className="fc_err"
              onClick={async () => {
                // if (record.children.length === 0) {

                // }
                let api = "/truck/cat1/remove";
                let res = await $.get(api, {cat1: record.cat1});
                getList();
                $.msg("操作成功~");
                return res;
              }}
            >
              删除
            </a>
          </span>)
        } else {
          return (
            <div>
                <span className="link" onClick={()=>series.open('修改子类', {...record, type: "set", cat1: tempCat1})}>修改</span>
                <span className="mh_5">|</span>
                <span className="link fc_err" onClick={()=>{deleteData(record)}}>删除</span>
            </div>
          )
        }
			}
		}
  ];

	return (
		<div className="br_3 bg_white pall_15">
      <Btn style={{marginTop: "-20px"}} onClick={() => addBrand.open("大类", {type: "add"}, )}>添加大类</Btn>
      <Table
        bordered
        className="minH"
        dataSource={tablelist}
        columns={columns}
        rowKey={(rs) => rs.cat1}
        scroll = {{ x: "max-content" }}
        pagination={{
          current: page,
          pageSize: limit,
          size: "middle",
          total: total,
          showTotal: () => `共${total}条`,
          onChange: getList
        }}
      />
      <BrandModal/>
			<SeriesModal />
		</div>
	);
}
