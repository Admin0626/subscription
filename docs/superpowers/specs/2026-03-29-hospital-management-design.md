# 医院管理系统设计方案

## 1. 项目概述

基于 RuoYi (若依) 框架开发医院管理系统，保留前端模板，重构后端 API 实现 REST API 接口。

- **项目类型**: 中小型医院综合管理信息系统 (HMIS)
- **技术栈**: Spring Boot + MyBatis + Shiro + MySQL + Thymeleaf
- **部署方式**: Windows 单机

## 2. 系统架构

```
前端 (RuoYi Thymeleaf + Hplus)
        │
        ▼
ruoyi-admin (Web层 - 控制器)
        │
        ▼
ruoyi-framework (Shiro安全 +  Druid + EhCache + AOP)
        │
        ├──────────────────┬──────────────────┐
        ▼                  ▼                  ▼
ruoyi-system       ruoyi-hospital      ruoyi-common
(原系统模块)        (新建业务模块)       (通用工具)
```

## 3. 模块设计

### 3.1 ruoyi-hospital 模块结构

| 子模块 | 功能 |
|--------|------|
| patient | 患者档案、过敏史、联系人 |
| outpatient | 门诊挂号、诊疗记录、处方 |
| inpatient | 住院登记、床位管理、医嘱 |
| pharmacy | 药品库存、处方发药、药房调拨 |
| medical-tech | 检查检验申请单、结果录入 |
| appointment | 医生排班、预约挂号、叫号 |
| billing | 收费项目、结算、发票 |
| statistics | 门诊/住院统计、收入报表 |

### 3.2 复用 RuoYi 原有模块

- **sys_user**: 医护用户管理
- **sys_dept**: 科室/病区管理
- **sys_role**: 角色权限
- **sys_menu**: 功能菜单
- **sys_dict**: 数据字典
- **sys_log**: 操作日志
- **sys_login_log**: 登录日志

## 4. 数据库设计

### 4.1 核心业务表

| 表名 | 说明 |
|------|------|
| hos_patient | 患者档案 |
| hos_registration | 门诊挂号 |
| hos_medical_record | 诊疗记录 |
| hos_prescription | 处方 |
| hos_prescription_detail | 处方明细 |
| hos_inpatient | 住院登记 |
| hos_bed | 床位管理 |
| hos_doctor_order | 医嘱 |
| hos_order_detail | 医嘱明细 |
| hos_pharmacy_drug | 药品库存 |
| hos_pharmacy_stock | 药房库存流水 |
| hos_prescription_dispense | 发药记录 |
| hos_exam_apply | 检查申请 |
| hos_exam_result | 检查结果 |
| hos_lab_apply | 检验申请 |
| hos_lab_result | 检验结果 |
| hos_appointment | 预约记录 |
| hos_schedule | 医生排班 |
| hos_charge_item | 收费项目 |
| hos_charge | 收费记录 |
| hos_charge_detail | 收费明细 |

## 5. 业务流程

### 5.1 门诊流程
```
挂号 → 分诊 → 诊疗 → 开处方/检查 → 收费 → 取药/检查
```

### 5.2 住院流程
```
入院登记 → 分配床位 → 医嘱下达 → 执行 → 出院结算
```

## 6. 开发方案

- 后端 API 完全重构为 RESTful 风格
- 保留 Shiro 安全框架
- 复用 Druid 数据库连接池
- 复用 EhCache 缓存
- 复用 RuoYi 前端模板
