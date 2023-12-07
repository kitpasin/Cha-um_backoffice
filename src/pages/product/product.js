import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HeadPageComponent from "../../components/layout/headpage/headpage";

import "./product.scss";
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
import ProductTab from "./product-tab/product-tab";
import { getMenuList, getProducts } from "../../services/product.service";
import { appActions } from "../../store/app-slice";

const ProductPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["product-page"]);
  const pageAvailable = useSelector(
    (state) => state.app.frontOffice.pageAvailable
  );
  const language = useSelector((state) => state.app.language);
  const [productTab, setProductTab] = useState("0");
  const [isRowDisplay, setIsRowDisplay] = useState(false);
  const [productData, setProductData] = useState([]);
  const [pageControl, setPageControl] = useState("");
  const [menuList, setMenuList] = useState([]);
  const [category, setCategory] = useState([]);
  const [refreshData, setRefreshData] = useState(0);
  const [productModalAdd, setProductModalAdd] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState(undefined);
  const [selectedCateId, setSelectedCateId] = useState(0);
  const [webContact, setWebcontact] = useState({});

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
      }
    });
  }, [language]);

  useEffect(() => {
    setProductData([]);
    dispatch(appActions.isSpawnActive(true));
    getProducts(language).then((res) => {
      console.log(res)
      if (res.status) {
        setProductData(res.data.product);
        setWebcontact(res.data.webInfo);
      }
      dispatch(appActions.isSpawnActive(false));
    });
  }, [refreshData, language]);

  const OnChangePageControlHandler = (e) => {
    setPageControl(e.target.value);
  };

  const filteredData = productData.filter((product) => {
    const matchesName = selectedProductName
      ? product.title === selectedProductName
      : true;
    const matchesCate = selectedCateId
      ? product.sub_cate_id === selectedCateId
      : true;
    return matchesName && matchesCate;
  });

  return (
    <section id="product-page">
      <HeadPageComponent
        h1={t("สินค้า")}
        icon={<FontAwesomeIcon icon={faNewspaper} />}
        breadcrums={[{ title: t("สินค้า"), link: false }]}
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
              onClick={() => setProductModalAdd(true)}
              className="btn-add-product"
              on="create"
              icon={<FontAwesomeIcon icon={faAdd} />}
            >
              {t("เพิ่มสินค้า")}
            </ButtonUI>
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <Autocomplete
              disablePortal
              options={productData.map((data) => data.title)}
              onChange={(e, newValue) => {
                const selectedName = productData.find(
                  (category) => category.title === newValue
                );
                setSelectedProductName(
                  selectedName ? selectedName.title : null
                );
              }}
              sx={{ width: 300 }}
              size="small"
              renderInput={(params) => <TextField {...params} label="ชื่อ" />}
            />
            <Autocomplete
              disablePortal
              options={menuList}
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

        <ProductTab
          productModalAdd={productModalAdd}
          setProductModalAdd={setProductModalAdd}
          setRefreshData={() => setRefreshData(refreshData + 1)}
          pageControl={pageControl}
          category={category}
          setCategory={setCategory}
          menuList={menuList}
          productTab={productTab}
          setProductTab={setProductTab}
          productData={filteredData}
          isRowDisplay={isRowDisplay}
          webContact={webContact}
        />
      </div>
    </section>
  );
};

export default ProductPage;
