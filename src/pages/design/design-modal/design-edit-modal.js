import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { svUpdateDesign } from "../../../services/design.service";
import ButtonUI from "../../../components/ui/button/button";
import PreviewImageUI from "../../../components/ui/preview-image/preview-image";
import FieldsetUI from "../../../components/ui/fieldset/fieldset";
import SwalUI from "../../../components/ui/swal-ui/swal-ui";
import CheckBoxUI from "../../../components/ui/check-box/check-box";
import CKeditorComponent from "../../../components/ui/ckeditor/ckeditor";

import "./design-edit-modal.scss";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faEdit,
  faMinus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  Switch,
  TextField,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment";

const editDataDefault = {
  id: null,
  thumbnail: "",
  thumbnail_link: "",
  thumbnail_name: "",
  thumbnail_title: "",
  thumbnail_alt: "",
  title: "",
  address: "",
  size: "",
  status: "",
  keyword: "",
  description: "",
  topic: "",
  slug: "",
  redirect: "",
  priority: 1,
  status_display: false,
  pin: false,
  is_maincontent: false,
  language: "",
  category: "",
};

const editDataValidDefault = {
  category: false,
  formValid: false,
  thumbnail_title: false,
  thumbnail_alt: false,
  title: false,
  address: false,
  size: false,
  status: false,
  keyword: false,
  description: false,
  slug: false,
  redirect: false,
  isMainContent: false,
  thumbnail_name: false,
};

const thumbnailDefault = {
  thumbnail: true,
  src: "",
  file: null,
  name: null,
  remove: false,
};
const url = window.location.origin + "/";

const ModalEditDesign = (props) => {
  const { t } = useTranslation("design-page");
  const { isEdit, isOpen, menuList, designsList, category, items } = props;
  const isSuperAdmin = useSelector(
    (state) => state.auth.userPermission.superAdmin
  );
  const language = useSelector((state) => state.app.language);
  const uploadPath = useSelector((state) => state.app.uploadPath);
  const [editData, setEditData] = useState(editDataDefault);
  const [editDataValid, setEditDataValid] = useState(editDataValidDefault);
  const [previews, setPreviews] = useState(thumbnailDefault);
  const [moreImage, setMoreImage] = useState([]);
  const [moreImageRemove, setMoreImageRemove] = useState([]);
  const [checkboxList, setCheckBoxList] = useState();
  const [ckValue, setCkValue] = useState(null);
  const [displayDate, setDisplayDate] = useState(null);
  const [hiddenDate, setHiddenDate] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [radioResult, setRadioResult] = useState(null);
  const [curImg, setCurImg] = useState("");

  useEffect(() => {
    if (items !== null) {
      let newData = {};
      for (let key in items) {
        if (
          key === "status_display" ||
          key === "is_maincontent" ||
          key === "pin"
        ) {
          newData[`${key}`] = items[key] === 1 ? true : false;
        } else {
          newData[`${key}`] = items[key] !== null ? items[key] : "";
        }
      }
      /* Set More Images */
      if (newData.imgId) {
        let imgId = newData.imgId.split(",");
        let imgAlt = newData.imgAlt.split(",");
        let imgLanguage = newData.imgLanguage.split(",");
        let imgLink = newData.imgLink.split(",");
        let imgTitle = newData.imgTitle.split(",");
        const imageArr = [];
        for (let i = 0; i < imgId.length; i++) {
          let srcImage = uploadPath + imgLink[i];
          if (imgLanguage[i] === language || !isEdit) {
            imageArr.push({
              index: i + 1,
              id: imgId[i],
              src: srcImage,
              srcDefault: srcImage,
              language: imgLanguage[i],
              title: imgTitle[i],
              alt: imgAlt[i],
              file: null,
              name: null,
              remove: true,
            });
          }
        }
        setMoreImage(imageArr);
      } else {
        setMoreImage([]);
      }

      /* Set thumbnail */
      let thumbnail = uploadPath + newData.thumbnail_link;
      setPreviews({
        file: null,
        src: thumbnail,
        remove: true,
        srcDefault: thumbnail,
      });

      /* Set Category */
      const cateList = category.map((c) => ({
        ...c,
        checked:
          newData.category.match(new RegExp(`,${c.id},`, "g")) !== null
            ? true
            : false,
      }));
      props.setCategory(cateList);
      setRadioResult(newData.sub_cate_id);

      /* Set CkValue */
      setCkValue(newData.content);

      /* Set Data */
      setEditData(newData);

      /* Set Date display - Hidden */
      setDisplayDate(
        newData.date_begin_display !== "" &&
          newData.date_begin_display !== "0000-00-00 00:00:00"
          ? newData.date_begin_display
          : null
      );
      setHiddenDate(
        newData.date_end_display !== "" &&
          newData.date_end_display !== "0000-00-00 00:00:00"
          ? newData.date_end_display
          : null
      );
    }
    const filePath = items.thumbnail_link.split("/");
    setCurImg(filePath[filePath.length - 1]);
    console.log(items);
  }, [items]);

  useEffect(() => {
    setCheckBoxList(category);
  }, [category]);

  const setPreviewHandler = (data) => {
    if (data.file) {
      setEditData({ ...editData, imageName: data.file.name });
    }

    if (data.src === undefined) {
      setPreviews(thumbnailDefault);
    } else {
      setPreviews(data);
    }
  };

  const addMoreImage = (data) => {
    setMoreImage([
      ...moreImage,
      {
        src: data.src,
        file: data.file,
        name: data.file.name,
        index: data.index,
        default: null,
        remove: true,
        title: "",
        alt: "",
      },
    ]);
  };

  const setMoreImagePreviewHandler = (data) => {
    if (data.file === undefined) {
      const result = moreImage.filter((m, index) => index !== data.index);
      setMoreImage(result);
    } else {
      const result = moreImage.map((m, index) => {
        if (index === data.index) {
          m.src = data.src;
          m.file = data.file;
          m.name = data.file ? data.file.name : "";
        }
        return m;
      });
      setMoreImage(result);
    }

    if (data.removeId !== null) {
      setMoreImageRemove((prev) => [...prev, data.removeId]);
    }
  };

  const displayHandleChange = (newValue) => {
    setDisplayDate(newValue);
  };

  const hiddenHandleChange = (newValue) => {
    setHiddenDate(newValue);
  };

  const changeMoreImageData = (i, obj) => {
    const result = moreImage.map((m, index) => {
      return index === i ? obj : m;
    });
    setMoreImage(result);
  };

  const saveModalHandler = (e) => {
    const cateListId = checkboxList
      .filter((f) => f.checked)
      .reduce((o, n) => {
        return o + n.id + ",";
      }, ",");

    setEditDataValid({
      ...editDataValid,
      title: editData.title === "",
      keyword: editData.keyword === "",
      address: editData.address === "",
      size: editData.size === "",
      status: editData.status === "",
      description: editData.description === "",
      slug: editData.slug === "",
      category: cateListId === ",",
    });
    if (
      editData.title === "" ||
      editData.address === "" ||
      editData.size === "" ||
      editData.status === "" ||
      // (cateListId === ",") ||
      isFetching
    ) {
      return false;
    }

    setIsFetching(true);
    const formData = new FormData();
    if (previews.file) {
      formData.append("Thumbnail", previews.file);
      formData.append("ThumbnailName", editData.imageName);
      formData.append("ThumbnailLink", editData.thumbnail_link);
      formData.append("ThumbnailTitle", editData.thumbnail_title);
      formData.append("ThumbnailAlt", editData.thumbnail_alt);
      formData.append("moreImageRemove", moreImageRemove);
    } else {
      formData.append("ThumbnailName", curImg);
      formData.append("ThumbnailLink", editData.thumbnail_link);
      formData.append("ThumbnailTitle", editData.thumbnail_title);
      formData.append("ThumbnailAlt", editData.thumbnail_alt);
      formData.append("moreImageRemove", moreImageRemove);
    }

    let moreImageLength = moreImage.length;
    if (moreImageLength > 0) {
      for (let i = 0; i < moreImageLength; i++) {
        if (moreImage[i].file) {
          formData.append(`Images[]`, moreImage[i].file);
          formData.append("ImagesName[]", moreImage[i].name);
          formData.append("ImagesTitle[]", moreImage[i].title);
          formData.append("ImagesAlt[]", moreImage[i].alt);
          formData.append("ImagesPosition[]", i);
        } else {
          let linkName = moreImage[i].srcDefault.split(uploadPath);
          formData.append(`EditImageTitle[]`, moreImage[i].title);
          formData.append(`EditImageAlt[]`, moreImage[i].alt);
          formData.append(`EditImageLink[]`, linkName[1] ? linkName[1] : "");
        }
      }
    }

    formData.append("id", editData.id);
    formData.append("sub_cate_id", radioResult);
    formData.append("category", radioResult);
    formData.append("title", editData.title);
    formData.append("keyword", editData.keyword);
    formData.append(
      "description",
      editData.description ? editData.description : ""
    );
    formData.append("address", editData.address);
    formData.append("size", editData.size);
    formData.append("status", editData.status);
    formData.append("slug", editData.slug);
    formData.append("topic", editData.topic);
    formData.append("content", ckValue ? ckValue : "");
    formData.append("redirect", editData.redirect);
    formData.append(
      "display_date",
      displayDate ? moment(displayDate).format() : null
    );
    formData.append(
      "hidden_date",
      hiddenDate ? moment(hiddenDate).format() : null
    );
    formData.append("status_display", editData.status_display ? 1 : 0);
    formData.append("pin", editData.pin ? 1 : 0);
    formData.append("is_maincontent", editData.is_maincontent ? 1 : 0);
    formData.append("priority", editData.priority);
    formData.append("old_priority", items.priority);
    formData.append("language", language);

    svUpdateDesign(editData.id, formData).then((res) => {
      setIsFetching(false);
      if (res.status) {
        props.setClose({
          isEdit: false,
          isOpen: false,
        });
        props.setRefreshData((prev) => prev + 1);
      }
      SwalUI({ status: res.status, description: res.description });
    });
  };

  console.log(previews.file);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Modal
        open={isOpen}
        onClose={() =>
          props.setClose({
            isEdit: false,
            isOpen: false,
          })
        }
        className={"modal-edit-design"}
        aria-labelledby="modal-edit-design"
        aria-describedby="modal-edit-design"
      >
        <Box className="modal-custom">
          <div className="modal-header">
            <h2>
              <FontAwesomeIcon icon={faEdit} />
              <span>{t("แก้ไขผลงาน")}</span>
            </h2>
            <IconButton
              className="param-generator"
              color="error"
              sx={{ p: "10px" }}
              onClick={() =>
                props.setClose({
                  isEdit: false,
                  isOpen: false,
                })
              }
            >
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </div>
          <div className="modal-body overflow-scroll-custom">
            <fieldset className="modal-fieldset">
              <legend className="modal-legend">
                {t("ModalEditDesignTitle")}
              </legend>

              <div style={{ width: "100%" }} className="form-details">
                <FieldsetUI className="image-setting" label={t("ข้อมูลรูปภาพ")}>
                  <PreviewImageUI
                    setCurImg={setCurImg}
                    className="edit-image"
                    previews={previews}
                    setPreviews={setPreviewHandler}
                  />

                  <div className="image-detail">
                    {/* {previews.file && (
                      <TextField
                        onChange={(e) => setEditData(prev => ({...prev, thumbnail_name: e.target.value}) )}
                        value={editData.thumbnail_name}
                        className="text-field-custom"
                        fullWidth={true}
                        error={editDataValid.thumbnail_name}
                        id="image-name"
                        label="Image name"
                        size="small"
                      />
                    )} */}

                    <TextField
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          thumbnail_title: e.target.value,
                        }))
                      }
                      value={editData.thumbnail_title}
                      className="text-field-custom"
                      fullWidth={true}
                      error={editDataValid.thumbnail_title}
                      id="image-title"
                      label="Image title"
                      size="small"
                    />
                    <TextField
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          thumbnail_alt: e.target.value,
                        }))
                      }
                      value={editData.thumbnail_alt}
                      className="text-field-custom"
                      fullWidth={true}
                      error={editDataValid.thumbnail_alt}
                      id="image-tag"
                      label="Alt description"
                      size="small"
                    />
                  </div>
                </FieldsetUI>
                <FieldsetUI
                  className="more-image-setting"
                  label={t("รูปภาพเพิ่มเติม")}
                >
                  {moreImage.map((m, index) => (
                    <div className="image-control" key={index}>
                      <PreviewImageUI
                        className="edit-more-image"
                        previews={{
                          src: m.src,
                          file: m.file,
                          index,
                          removeId: m.id,
                          remove: true,
                        }}
                        setPreviews={setMoreImagePreviewHandler}
                      />
                      <div className="image-detail">
                        {/* {m.file && (
                            <TextField
                              onChange={(e) => changeMoreImageData(index, {...m, name: e.target.value})}
                              value={m.name}
                              className="text-field-custom"
                              fullWidth={true}
                              id={`image-name-${index}`}
                              label={`Image Name ${index + 1}`}
                              size="small"
                            />
                          )} */}
                        <TextField
                          onChange={(e) =>
                            changeMoreImageData(index, {
                              ...m,
                              title: e.target.value,
                            })
                          }
                          value={m.title}
                          className="text-field-custom"
                          fullWidth={true}
                          error={editDataValid.thumbnail_title}
                          id="image-title"
                          label="Image title"
                          size="small"
                        />
                        <TextField
                          onChange={(e) =>
                            changeMoreImageData(index, {
                              ...m,
                              alt: e.target.value,
                            })
                          }
                          value={m.alt}
                          className="text-field-custom"
                          fullWidth={true}
                          error={editDataValid.thumbnail_alt}
                          id="image-tag"
                          label="Alt description"
                          size="small"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="image-control">
                    <PreviewImageUI
                      srcError={"/images/add-image.jpg"}
                      className="edit-image"
                      previews={{ src: "", file: "", remove: false }}
                      setPreviews={addMoreImage}
                    />
                  </div>
                </FieldsetUI>
                <h3 className="design-detail-title">{t("รายละเอียด")}</h3>
                <TextField
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  value={editData.title}
                  className="text-field-custom"
                  fullWidth={true}
                  error={editDataValid.title}
                  id="cate-title"
                  label="Title"
                  size="small"
                />
                {/* <TextField
                  onChange={(e) => setEditData({...editData, keyword: e.target.value})}
                  value={editData.keyword}
                  className="text-field-custom"
                  fullWidth={true}
                  error={editDataValid.keyword}
                  id="cate-keyword"
                  label="Keyword"
                  size="small"
                /> */}
                <TextField
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  value={editData.description}
                  className="text-field-custom"
                  fullWidth={true}
                  error={editDataValid.description}
                  id="cate-description"
                  label="Description"
                  size="small"
                />
                <TextField
                  onChange={(e) =>
                    setEditData({ ...editData, address: e.target.value })
                  }
                  value={editData.address}
                  className="text-field-custom"
                  fullWidth={true}
                  error={editDataValid.address}
                  id="cate-address"
                  label="Address"
                  size="small"
                />
                <TextField
                  onChange={(e) =>
                    setEditData({ ...editData, size: e.target.value })
                  }
                  value={editData.size}
                  className="text-field-custom"
                  fullWidth={true}
                  error={editDataValid.size}
                  id="cate-size"
                  label="Size"
                  size="small"
                />
                <TextField
                  onChange={(e) =>
                    setEditData({ ...editData, status: e.target.value })
                  }
                  value={editData.status}
                  className="text-field-custom"
                  fullWidth={true}
                  error={editDataValid.status}
                  id="cate-status"
                  label="Status"
                  size="small"
                />
                {/* <TextField
                  onChange={(e) => setEditData({...editData, slug: e.target.value})}
                  placeholder="slug/example"
                  value={editData.slug}
                  className="text-field-custom"
                  fullWidth={true}
                  error={editDataValid.slug}
                  id="cate-url"
                  label={url}
                  size="small"
                /> */}
                {/* <TextField
                  onChange={(e) => setEditData({...editData, topic: e.target.value})}
                  placeholder="Topic Name"
                  value={editData.topic}
                  className="text-field-custom"
                  fullWidth={true}
                  error={editDataValid.topic}
                  id="inp-topic"
                  label="Topic"
                  size="small"
                /> */}
                <div style={{ marginTop: "1rem" }} className="ck-content">
                  {/* <label className="ck-edit-design">Content</label> */}
                  {ckValue !== null && (
                    <CKeditorComponent
                      ckNameId="ck-edit-design"
                      value={ckValue}
                      onUpdate={setCkValue}
                    />
                  )}
                </div>
                {/* <TextField
                  onChange={(e) => setEditData({...editData, redirect: e.target.value})}
                  placeholder="Link Url"
                  value={editData.redirect}
                  className="text-field-custom"
                  fullWidth={true}
                  error={editDataValid.redirect}
                  id="cate-redirect"
                  label="Redirect"
                  size="small"
                /> */}

                <div className="input-date">
                  <div className="input-half pr">
                    <DateTimePicker
                      className="date-input"
                      size="small"
                      label={t("Display Display")}
                      value={displayDate}
                      onChange={displayHandleChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
                  <div className="input-half pl">
                    <DateTimePicker
                      className="date-input"
                      sx={{ width: 250 }}
                      label={t("Hidden Date")}
                      value={hiddenDate}
                      onChange={hiddenHandleChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
                </div>

                <h3 className="design-detail-title">{t("การแสดงผล")}</h3>
                <div className="setting-controls">
                  <div className="switch-form">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                status_display: e.target.checked,
                              })
                            }
                            checked={editData.status_display}
                          />
                        }
                        label={t("แสดงบนเว็บไซต์")}
                        labelPlacement="start"
                      />
                    </FormGroup>
                  </div>
                  <div className="switch-form">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                pin: e.target.checked,
                              })
                            }
                          />
                        }
                        checked={editData.pin}
                        label={t("ปักหมุด")}
                        labelPlacement="start"
                      />
                    </FormGroup>
                  </div>
                  {/* {isSuperAdmin && (
                    <div className="switch-form">
                      <FormGroup>
                        <FormControlLabel  control={<Switch onChange={(e) => setEditData({...editData, is_maincontent: e.target.checked})} checked={editData.is_maincontent} /> }   label="Main Content" labelPlacement="start" />
                      </FormGroup>
                    </div>
                  )} */}

                  {/* <div className="input-group">
                    <div className="inp"> 
                      <ButtonUI
                        color="error"
                        onClick={(e) => (editData.priority > 1)?setEditData({...editData, priority: editData.priority - 1}):""} >
                        <FontAwesomeIcon icon={faMinus} />
                      </ButtonUI>
                      <span className="title">
                        {t("ModalPriority")} {editData.priority}
                      </span>
                      <ButtonUI onClick={(e) => setEditData({...editData, priority: editData.priority + 1}) }>
                        <FontAwesomeIcon icon={faAdd} />
                      </ButtonUI>
                    </div>
                  </div> */}
                </div>
              </div>
            </fieldset>
          </div>
          <div className="modal-footer">
            <ButtonUI
              loader={true}
              isLoading={isFetching}
              className="btn-save"
              on="save"
              width="md"
              onClick={saveModalHandler}
            >
              {t("Save")}
            </ButtonUI>
            <ButtonUI
              className="btn-cancel"
              on="cancel"
              width="md"
              onClick={() =>
                props.setClose({
                  isEdit: false,
                  isOpen: false,
                })
              }
            >
              {t("Cancel")}
            </ButtonUI>
          </div>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default ModalEditDesign;
