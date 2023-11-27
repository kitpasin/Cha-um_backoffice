import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HeadPageComponent from "../../components/layout/headpage/headpage";

import "./portfolio.scss";
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
import PortfolioTab from "./portfolio-tab/portfolio-tab";
import { getMenuList, getPortfolios } from "../../services/portfolio.service";
import { appActions } from "../../store/app-slice";

const PortfolioPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["portfolio-page"]);
  const pageAvailable = useSelector(
    (state) => state.app.frontOffice.pageAvailable
  );
  const language = useSelector((state) => state.app.language);
  const [portfolioTab, setPortfolioTab] = useState("0");
  const [isRowDisplay, setIsRowDisplay] = useState(false);
  const [portfolioData, setPortfolioData] = useState([]);
  const [pageControl, setPageControl] = useState("");
  const [menuList, setMenuList] = useState([]);
  const [category, setCategory] = useState([]);
  const [refreshData, setRefreshData] = useState(0);
  const [portfolioModalAdd, setPortfolioModalAdd] = useState(false);
  const [selectedPortfolioName, setSelectedPortfolioName] = useState(undefined);
  const [selectedCateId, setSelectedCateId] = useState(0);
  const [portfoliosList, setPortfoliosList] = useState([])

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
        setPortfoliosList(res.portfolios)
      }
    });
  }, [language]);

  useEffect(() => {
    setPortfolioData([]);
    dispatch(appActions.isSpawnActive(true));
    getPortfolios(language).then((res) => {
      if (res.status) {
        setPortfolioData(res.data);
      }
      dispatch(appActions.isSpawnActive(false));
    });
  }, [refreshData, language]);

  const OnChangePageControlHandler = (e) => {
    setPageControl(e.target.value);
  };

  const filteredData = portfolioData.filter((portfolio) => {
    const matchesName = selectedPortfolioName
      ? portfolio.title === selectedPortfolioName
      : true;
    const matchesCate = selectedCateId
      ? portfolio.sub_cate_id === selectedCateId
      : true;
    return matchesName && matchesCate;
  });

  return (
    <section id="portfolio-page">
      <HeadPageComponent
        h1={t("ผลงาน")}
        icon={<FontAwesomeIcon icon={faNewspaper} />}
        breadcrums={[{ title: t("ผลงาน"), link: false }]}
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
              onClick={() => setPortfolioModalAdd(true)}
              className="btn-add-portfolio"
              on="create"
              icon={<FontAwesomeIcon icon={faAdd} />}
            >
              {t("เพิ่มผลงาน")}
            </ButtonUI>
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <Autocomplete
              disablePortal
              options={portfolioData.map((data) => data.title)}
              onChange={(e, newValue) => {
                const selectedName = portfolioData.find(
                  (category) => category.title === newValue
                );
                setSelectedPortfolioName(
                  selectedName ? selectedName.title : null
                );
              }}
              sx={{ width: 300 }}
              size="small"
              renderInput={(params) => <TextField {...params} label="ชื่อ" />}
            />
          </div>
        </div>

        <PortfolioTab
          portfolioModalAdd={portfolioModalAdd}
          setPortfolioModalAdd={setPortfolioModalAdd}
          setRefreshData={() => setRefreshData(refreshData + 1)}
          pageControl={pageControl}
          category={category}
          setCategory={setCategory}
          menuList={menuList}
          portfoliosList={portfoliosList}
          portfolioTab={portfolioTab}
          setPortfolioTab={setPortfolioTab}
          portfolioData={filteredData}
          isRowDisplay={isRowDisplay}
        />
      </div>
    </section>
  );
};

export default PortfolioPage;
