import React from "react";
import { Divider, Tabs } from "antd";
import { $, Page, Form, TablePagination, Modals, Inputs, Btn } from "../comlibs";
import CarBrand from "./CarBrand";
import UseType from "./UseType";
import Market from "./Market";
import ParamConfig from "./ParamConfig";

const { TabPane } = Tabs;

export default function() {
  let {dataTab = "brand"} = {};

	return (
		<div className="br_3 bg_white pall_15">
      <Tabs
        defaultActiveKey={dataTab}
        onChange={(e) => {
          dataTab = e;
          // if (e === "oldCars") {
          //   oldOpen && oldOpen.reload();
          // }
        }}
      >
        <TabPane tab="车辆品牌" key="brand">
          <CarBrand/>
        </TabPane>
        <TabPane tab="用途类别" key="useType">
          <UseType/>
        </TabPane>
        <TabPane tab="细分市场" key="market">
          <Market/>
        </TabPane>
        {/* <TabPane tab="参数配置" key="paramConfig">
          <ParamConfig/>
        </TabPane> */}
      </Tabs>
		</div>
	);
}
