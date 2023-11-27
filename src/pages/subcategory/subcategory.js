import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HeadPageComponent from "../../components/layout/headpage/headpage";
import { useDispatch, useSelector } from "react-redux";
import ContentFormatButton from "../../components/ui/toggle-format/toggle-format";
import SubCategoryTab from "./subcategory-tab/subcategory-tab";
import SubModalAddCategory from "./subcategory-modal/subcate-add-modal";
import ButtonUI from "../../components/ui/button/button";
import { appActions } from "../../store/app-slice";
import { getCategory, getSubCategory } from "../../services/category.service";
import SubModalEditCategory from "./subcategory-modal/subcate-edit-modal";

import "../category/category.scss";
import { faAdd, faSitemap, faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Autocomplete, TextField } from "@mui/material";

const SubCategoryPage = () => {
  const { t } = useTranslation(["category-page"]);
  const dispatch = useDispatch();
  const language = useSelector((state) => state.app.language);
  const [categoryTab, setCategoryTab] = useState("0");
  const [isRowDisplay, setIsRowDisplay] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [subMenuList, setSubMenuList] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [modalAddCate, setModalAddCate] = useState(false);
  const [modalEditCate, setModalEditCate] = useState(false);
  const [refreshData, setRefreshData] = useState(0);
  const [selectedCateName, setSelectedName] = useState(undefined);
  const [selectedCateId, setSelectedCateId] = useState(0);

  useEffect(() => {
    dispatch(appActions.isSpawnActive(true));
    getCategory(language).then((res) => {
      setCategoryData(res.data);
      setSubCategoryData(res.subdata);
      setMenuList(res.menu);
      setSubMenuList(res.submenu);
      dispatch(appActions.isSpawnActive(false));
    });
  }, [refreshData, language]);

  const filteredSubCateData = subCategoryData.filter((subcate) => {
    const matchesName = selectedCateName ? subcate.cate_title === selectedCateName : true;
    const matchesId = selectedCateId ? subcate.main_cate_id == selectedCateId : true;
    return matchesName && matchesId;
  })

  return (
    <section id="category-page">
      <HeadPageComponent
        h1={"หมวดหมู่ย่อย"}
        icon={<FontAwesomeIcon icon={faSitemap} />}
        breadcrums={[{ title: "หมวดหมู่ย่อย", link: false }]}
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
                {t("Fetch")}
              </ButtonUI>
            </h2>

            <ContentFormatButton
              isRowDisplay={isRowDisplay}
              setIsRowDisplay={setIsRowDisplay}
            />

            <ButtonUI
              onClick={() => setModalAddCate(true)}
              className="btn-add-category"
              on="create"
              isLoading={false}
              icon={<FontAwesomeIcon icon={faAdd} />}
            >
              {t("เพิ่มหมวดหมู่ย่อย")}
            </ButtonUI>
          </div>
          <div style={{display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <Autocomplete
              disablePortal
              options={subCategoryData.map((data) => data.cate_title)}
              onChange={(e, newValue) => {
                const selectedName = subCategoryData.find(
                  (category) => category.cate_title === newValue
                );
                setSelectedName(
                  selectedName ? selectedName.cate_title : null
                );
              }}
              sx={{ width: 300 }}
              size="small"
              renderInput={(params) => (
                <TextField {...params} label="ชื่อ" />
              )}
            />
            <Autocomplete
              disablePortal
              options={menuList.map((list) => list.title)}
              onChange={(e, newValue) => {
                const selectedCategory = menuList.find(
                  (category) => category.title === newValue
                );
                setSelectedCateId(
                  selectedCategory ? selectedCategory.id : null
                );
              }}
              sx={{ width: 300 }}
              size="small"
              renderInput={(params) => (
                <TextField {...params} label="หมวดหมู่" />
              )}
            />
          </div>
        </div>

        <SubCategoryTab
          totalData={totalData}
          setTotalData={setTotalData}
          setRefreshData={setRefreshData}
          isRowDisplay={isRowDisplay}
          setModalEditCate={setModalEditCate}
          tabSelect={categoryTab}
          setCategoryTab={setCategoryTab}
          categoryData={categoryData}
          subCategoryData={filteredSubCateData}
          selectedCateName={selectedCateName}
          selectedCateId={selectedCateId}
        />

        <SubModalAddCategory
          totalData={totalData}
          setRefreshData={setRefreshData}
          menuList={menuList}
          subMenuList={subMenuList}
          isOpen={modalAddCate}
          setClose={setModalAddCate}
          categoryData={categoryData}
          subCategoryData={subCategoryData}
        />

        <SubModalEditCategory
          categoryData={categoryData}
          subCategoryData={subCategoryData}
          setRefreshData={setRefreshData}
          menuList={menuList}
          isOpen={modalEditCate}
          setClose={setModalEditCate}
        />
      </div>
    </section>
  );
};

export default SubCategoryPage;
