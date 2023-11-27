import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HeadPageComponent from "../../components/layout/headpage/headpage";

import "./service.scss";
import {
  faAdd,
  faImages,
  faRedo,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonUI from "../../components/ui/button/button";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ContentFormatButton from "../../components/ui/toggle-format/toggle-format";
import ServiceTab from "./service-tab/service-tab";
import { getMenuList, getServices } from "../../services/service.service";
import { appActions } from "../../store/app-slice";

const ServicePage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["service-page"]);
  const pageAvailable = useSelector(
    (state) => state.app.frontOffice.pageAvailable
  );
  const language = useSelector((state) => state.app.language);
  const [serviceTab, setServiceTab] = useState("0");
  const [isRowDisplay, setIsRowDisplay] = useState(false);
  const [serviceData, setServiceData] = useState([]);
  const [pageControl, setPageControl] = useState("");
  const [menuList, setMenuList] = useState([]);
  const [category, setCategory] = useState([]);
  const [refreshData, setRefreshData] = useState(0);
  const [serviceModalAdd, setServiceModalAdd] = useState(false);
  const [selectedServiceName, setSelectedServiceName] = useState(undefined);
  const [selectedCateId, setSelectedCateId] = useState(0);
  const [servicesList, setServicesList] = useState([])

  useEffect(() => {
    getMenuList(language).then((res) => {
      if (res.status) {
        let arr = [];
        for (let obj of res.category) {
          arr[`${obj.id}`] = {
            id: obj.id,
            title: obj.cate_title,
            language: obj.language,
            level: obj.cate_level,
            rootId: obj.cate_root_id,
            parentId: obj.cate_parent_id,
            checked: false,
          };
        }
        setCategory(arr);
        setMenuList(res.menu);
        setServicesList(res.services)
      }
    });
  }, [language]);

  useEffect(() => {
    setServiceData([]);
    dispatch(appActions.isSpawnActive(true));
    getServices(language).then((res) => {
      if (res.status) {
        setServiceData(res.data);
      }
      dispatch(appActions.isSpawnActive(false));
    });
  }, [refreshData, language]);

  const OnChangePageControlHandler = (e) => {
    setPageControl(e.target.value);
  };

  const filteredData = serviceData.filter((service) => {
    const matchesName = selectedServiceName
      ? service.title === selectedServiceName
      : true;
    const matchesCate = selectedCateId
      ? service.sub_cate_id === selectedCateId
      : true;
    return matchesName && matchesCate;
  });

  console.log(servicesList)

  return (
    <section id="service-page">
      <HeadPageComponent
        h1={t("บริการ")}
        icon={<FontAwesomeIcon icon={faNewspaper} />}
        breadcrums={[{ title: t("บริการ"), link: false }]}
      />
      <div className="card-control fixed-width">
        <div style={{ paddingBottom: "0" }} className="card-head">
          <div className="head-action">
            <h2 className="head-title">
              <ButtonUI
                onClick={() => setRefreshData(refreshData + 1)}
                on="create"
                isLoading={false}
                icon={<FontAwesomeIcon icon={faRedo} />}
              >
                {t("ดึงข้อมูล")}
              </ButtonUI>
            </h2>
            <ContentFormatButton
              isRowDisplay={isRowDisplay}
              setIsRowDisplay={setIsRowDisplay}
            />

            <ButtonUI
              onClick={() => setServiceModalAdd(true)}
              className="btn-add-service"
              on="create"
              icon={<FontAwesomeIcon icon={faAdd} />}
            >
              {t("เพิ่มบริการ")}
            </ButtonUI>
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <Autocomplete
              disablePortal
              options={serviceData.map((data) => data.title)}
              onChange={(e, newValue) => {
                const selectedName = serviceData.find(
                  (category) => category.title === newValue
                );
                setSelectedServiceName(
                  selectedName ? selectedName.title : null
                );
              }}
              sx={{ width: 300 }}
              size="small"
              renderInput={(params) => <TextField {...params} label="ชื่อ" />}
            />
            <Autocomplete
              disablePortal
              options={servicesList}
              getOptionLabel={(option) => option.cate_title}
              onChange={(e, value) => setSelectedCateId(value ? value.id : null)}
              sx={{ width: 300 }}
              size="small"
              renderInput={(params) => (
                <TextField {...params} label="ประเภท" />
              )}
            />
          </div>
        </div>

        <ServiceTab
          serviceModalAdd={serviceModalAdd}
          setServiceModalAdd={setServiceModalAdd}
          setRefreshData={() => setRefreshData(refreshData + 1)}
          pageControl={pageControl}
          category={category}
          setCategory={setCategory}
          menuList={menuList}
          servicesList={servicesList}
          serviceTab={serviceTab}
          setServiceTab={setServiceTab}
          serviceData={filteredData}
          isRowDisplay={isRowDisplay}
        />
      </div>
    </section>
  );
};

export default ServicePage;
