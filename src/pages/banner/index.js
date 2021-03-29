import React from "react";
import { Divider, Alert } from "antd";
import { $, Form, TablePagination, Modals, Inputs, Btn, Page } from "../comlibs";
import Add from "./Add";

export default function() {
  let { tableList, addBanner, series }={}

	let columns = [
		{
			title: "标题",
      dataIndex: "banner_title",
      width: 220
		},
		{
      title: "图片",
      dataIndex: "banner_cover",
      render: (text) => {
        return <img src={text} alt="图片丢掉了" width="130px" height="68px" />
      }
		},
		{
      title: "顺序",
      dataIndex: "sort",
		},
		{
      title: "链接类型",
      dataIndex: "link_type",
      render: (text) => {
        return <span>{text === 'NULL' ? "无" : (text === 'XCX' ? "小程序" : text)}</span>
      }
		},
		{
      title: "地址",
      dataIndex: "link_url",
      width: 220,
      render: (text) => {
        return <span>{text || '-'}</span>
      }
		},
		{
      title: "状态",
      dataIndex: "onsell",
      render: (text) => {
        return <span>{text === 'YES' ? "上架中" : "下架中"}</span>
      }
		},
		{
			title: "操作",
			width: 170,
			align:'center',
			render: (text, record) => {
        if (record.username === "admin") {
          return (<span>-</span>)
        } else {
          return (<span>
            <a onClick={async () => {
              let api = record.onsell === 'YES' ? '/banner/offsell' : '/banner/onsell'
              let res = await $.post(api, {banner_uuid: record.banner_uuid})
              $.msg("操作成功~");
              tableList.reload()
              return res
            }}
            style={record.onsell === 'YES' ? {color: '#999999'} : undefined}>{
              record.onsell === 'YES' ? "下架" : "上架"
            }</a>
            <Divider type="vertical" />
            <a onClick={() => addBanner.open("编辑", record, {left: 300})}>编辑</a>
            <Divider type="vertical" />
            <a onClick={async () => {
              let res = await $.get('/banner/remove', {banner_uuid: record.banner_uuid});
              $.msg("操作成功~");
              tableList.reload()
              return res
            }} style={{color: '#FF6057'}}>删除</a>
          </span>)
        }
    }}
  ];

	return (
		<div className="br_3 bg_white pall_15">
      <Btn className="mv_15" onClick={() => addBanner.open("添加banner", {}, {left: 300})}>添加banner</Btn>
      <Alert message="小程序端banner只展示排序前5个，数字越大排序越靠前" type="info" showIcon className='mb_15' />
      <TablePagination api="/banner/query" columns={columns} ref={(rs) => tableList = rs} />
      <Page ref={(rs) => addBanner = rs} onClose={() => tableList.reload()}>
        <Add/>
			</Page>
		</div>
	);
}
