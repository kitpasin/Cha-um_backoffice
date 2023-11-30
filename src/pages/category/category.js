import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HeadPageComponent from "../../components/layout/headpage/headpage";
import { useDispatch, useSelector } from "react-redux";
import ContentFormatButton from "../../components/ui/toggle-format/toggle-format";
import CategoryTab from "./category-tab/category-tab";
import ModalAddCategory from "./category-modal/cate-add-modal";
import ButtonUI from "../../components/ui/button/button";
import { appActions } from "../../store/app-slice";
import { getCategory } from "../../services/category.service";
import ModalEditCategory from "./category-modal/cate-edit-modal";

import "./category.scss";
import { faAdd, faSitemap, faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Autocomplete, TextField } from "@mui/material";

const CategoryPage = () => {
  const isSuerperAdmin = useSelector(
    (state) => state.auth.userPermission.superAdmin
  );
  const { t } = useTranslation(["category-page"]);
  const dispatch = useDispatch();
  const language = useSelector((state) => state.app.language);
  const [categoryTab, setCategoryTab] = useState("0");
  const [isRowDisplay, setIsRowDisplay] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [modalAddCate, setModalAddCate] = useState(false);
  const [modalEditCate, setModalEditCate] = useState(false);
  const [refreshData, setRefreshData] = useState(0);
  const [selectedCateName, setSelectedName] = useState(undefined);

  console.log(isSuerperAdmin);

  useEffect(() => {
    dispatch(appActions.isSpawnActive(true));
    getCategory(language).then((res) => {
      setCategoryData(res.data);
      setMenuList(res.menu);
      dispatch(appActions.isSpawnActive(false));
    });
  }, [refreshData, language]);

  return (
    <section id="category-page">
      <HeadPageComponent
        h1={"หมวดหมู่หลัก"}
        icon={<FontAwesomeIcon icon={faSitemap} />}
        breadcrums={[{ title: "หมวดหมู่หลัก", link: false }]}
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
            {isSuerperAdmin && (
              <ButtonUI
                onClick={() => setModalAddCate(true)}
                className="btn-add-category"
                on="create"
                isLoading={false}
                icon={<FontAwesomeIcon icon={faAdd} />}
              >
                {t("เพิ่มหมวดหมู่หลัก")}
              </ButtonUI>
            )}
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <Autocomplete
              disablePortal
              options={categoryData?.map((data) => data.cate_title)}
              onChange={(e, newValue) => {
                const selectedName = categoryData.find(
                  (category) => category.cate_title === newValue
                );
                setSelectedName(selectedName ? selectedName.cate_title : null);
              }}
              sx={{ width: 300 }}
              size="small"
              renderInput={(params) => <TextField {...params} label="ชื่อ" />}
            />
          </div>
        </div>

        <CategoryTab
          totalData={totalData}
          setTotalData={setTotalData}
          setRefreshData={setRefreshData}
          isRowDisplay={isRowDisplay}
          setModalEditCate={setModalEditCate}
          tabSelect={categoryTab}
          setCategoryTab={setCategoryTab}
          categoryData={categoryData}
          selectedCateName={selectedCateName}
        />

        <ModalAddCategory
          totalData={totalData}
          setRefreshData={setRefreshData}
          menuList={menuList}
          isOpen={modalAddCate}
          setClose={setModalAddCate}
          categoryData={categoryData}
        />

        <ModalEditCategory
          categoryData={categoryData}
          setRefreshData={setRefreshData}
          menuList={menuList}
          isOpen={modalEditCate}
          setClose={setModalEditCate}
        />
      </div>
    </section>
  );
};

export default CategoryPage;
