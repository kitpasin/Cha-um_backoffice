import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HeadPageComponent from "../../components/layout/headpage/headpage";

import "./design.scss";
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
import DesignTab from "./design-tab/design-tab";
import { getMenuList, getDesigns } from "../../services/design.service";
import { appActions } from "../../store/app-slice";

const DesignPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["design-page"]);
  const pageAvailable = useSelector(
    (state) => state.app.frontOffice.pageAvailable
  );
  const language = useSelector((state) => state.app.language);
  const [designTab, setDesignTab] = useState("0");
  const [isRowDisplay, setIsRowDisplay] = useState(false);
  const [designData, setDesignData] = useState([]);
  const [pageControl, setPageControl] = useState("");
  const [menuList, setMenuList] = useState([]);
  const [category, setCategory] = useState([]);
  const [refreshData, setRefreshData] = useState(0);
  const [designModalAdd, setDesignModalAdd] = useState(false);
  const [selectedDesignName, setSelectedDesignName] = useState(undefined);
  const [selectedCateId, setSelectedCateId] = useState(0);
  const [designsList, setDesignsList] = useState([])

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
        setDesignsList(res.designs)
      }
    });
  }, [language]);

  useEffect(() => {
    setDesignData([]);
    dispatch(appActions.isSpawnActive(true));
    getDesigns(language).then((res) => {
      if (res.status) {
        setDesignData(res.data);
      }
      dispatch(appActions.isSpawnActive(false));
    });
  }, [refreshData, language]);

  const OnChangePageControlHandler = (e) => {
    setPageControl(e.target.value);
  };

  const filteredData = designData.filter((design) => {
    const matchesName = selectedDesignName
      ? design.title === selectedDesignName
      : true;
    const matchesCate = selectedCateId
      ? design.sub_cate_id === selectedCateId
      : true;
    return matchesName && matchesCate;
  });

  return (
    <section id="design-page">
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
              onClick={() => setDesignModalAdd(true)}
              className="btn-add-design"
              on="create"
              icon={<FontAwesomeIcon icon={faAdd} />}
            >
              {t("เพิ่มผลงาน")}
            </ButtonUI>
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <Autocomplete
              disablePortal
              options={designData.map((data) => data.title)}
              onChange={(e, newValue) => {
                const selectedName = designData.find(
                  (category) => category.title === newValue
                );
                setSelectedDesignName(
                  selectedName ? selectedName.title : null
                );
              }}
              sx={{ width: 300 }}
              size="small"
              renderInput={(params) => <TextField {...params} label="ชื่อ" />}
            />
          </div>
        </div>

        <DesignTab
          designModalAdd={designModalAdd}
          setDesignModalAdd={setDesignModalAdd}
          setRefreshData={() => setRefreshData(refreshData + 1)}
          pageControl={pageControl}
          category={category}
          setCategory={setCategory}
          menuList={menuList}
          designsList={designsList}
          designTab={designTab}
          setDesignTab={setDesignTab}
          designData={filteredData}
          isRowDisplay={isRowDisplay}
        />
      </div>
    </section>
  );
};

export default DesignPage;
