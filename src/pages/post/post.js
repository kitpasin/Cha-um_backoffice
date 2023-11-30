import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HeadPageComponent from "../../components/layout/headpage/headpage";

import "./post.scss";
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
import PostTab from "./post-tab/post-tab";
import { getMenuList, getPosts } from "../../services/post.service";
import { appActions } from "../../store/app-slice";

const PostPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["post-page"]);
  const pageAvailable = useSelector(
    (state) => state.app.frontOffice.pageAvailable
  );
  const language = useSelector((state) => state.app.language);
  const [postTab, setPostTab] = useState("0");
  const [isRowDisplay, setIsRowDisplay] = useState(false);
  const [postData, setPostData] = useState([]);
  const [pageControl, setPageControl] = useState("");
  const [menuList, setMenuList] = useState([]);
  const [category, setCategory] = useState([]);
  const [refreshData, setRefreshData] = useState(0);
  const [postModalAdd, setPostModalAdd] = useState(false);
  const [selectedPostName, setSelectedPostName] = useState(undefined);
  const [selectedCateId, setSelectedCateId] = useState(0);
  const isSuerperAdmin = useSelector(
    (state) => state.auth.userPermission.superAdmin
  );

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
    setPostData([]);
    dispatch(appActions.isSpawnActive(true));
    getPosts(language).then((res) => {
      if (res.status) {
        setPostData(res.data);
      }
      dispatch(appActions.isSpawnActive(false));
    });
  }, [refreshData, language]);

  const OnChangePageControlHandler = (e) => {
    setPageControl(e.target.value);
  };

  const filteredData = postData.filter((post) => {
    const matchesName = selectedPostName
      ? post.title === selectedPostName
      : true;
    const matchesCate = selectedCateId
      ? post.category.split(",")[1] === selectedCateId.toString()
      : true;
    return matchesName && matchesCate;
  });

  return (
    <section id="post-page">
      <HeadPageComponent
        h1={t("โพสต์")}
        icon={<FontAwesomeIcon icon={faNewspaper} />}
        breadcrums={[{ title: t("โพสต์"), link: false }]}
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
            {/* <FormControl className="searchpage" variant="standard">
              <InputLabel id="filter-pgae">{t("selectPageControl")}</InputLabel>
              <Select labelId="post-pgae"
                autoWidth
                id="filter-page"
                label="Page Control"
                className="input-page"
                size="small"
                onChange={OnChangePageControlHandler}
                value={pageControl} >
                <MenuItem value="">{t("selectPageControlNone")}</MenuItem>
                {pageAvailable &&
                  pageAvailable.map((menu) => (
                    <MenuItem 
                      key={menu.id} 
                      value={menu.id}>
                      {menu.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>  */}
            {isSuerperAdmin && (
              <ButtonUI
                onClick={() => setPostModalAdd(true)}
                className="btn-add-post"
                on="create"
                icon={<FontAwesomeIcon icon={faAdd} />}
              >
                {t("เพิ่มโพส")}
              </ButtonUI>
            )}
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <Autocomplete
              disablePortal
              options={postData.map((data) => data.title)}
              onChange={(e, newValue) => {
                const selectedName = postData.find(
                  (category) => category.title === newValue
                );
                setSelectedPostName(selectedName ? selectedName.title : null);
              }}
              sx={{ width: 300 }}
              size="small"
              renderInput={(params) => <TextField {...params} label="ชื่อ" />}
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

        <PostTab
          postModalAdd={postModalAdd}
          setPostModalAdd={setPostModalAdd}
          setRefreshData={() => setRefreshData(refreshData + 1)}
          pageControl={pageControl}
          category={category}
          setCategory={setCategory}
          menuList={menuList}
          postTab={postTab}
          setPostTab={setPostTab}
          postData={filteredData}
          isRowDisplay={isRowDisplay}
        />
      </div>
    </section>
  );
};

export default PostPage;
