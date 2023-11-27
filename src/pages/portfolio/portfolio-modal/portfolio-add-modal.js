import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { svCreatePortfolio } from "../../../services/portfolio.service";
import ButtonUI from "../../../components/ui/button/button";
import PreviewImageUI from "../../../components/ui/preview-image/preview-image";
import FieldsetUI from "../../../components/ui/fieldset/fieldset";
import SwalUI from "../../../components/ui/swal-ui/swal-ui";
import CheckBoxUI from "../../../components/ui/check-box/check-box";
import CKeditorComponent from "../../../components/ui/ckeditor/ckeditor";

import "./portfolio-add-modal.scss";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faMinus, faXmark } from "@fortawesome/free-solid-svg-icons";
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

const addDataDefault = {
  id: null,
  thumbnail: "",
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
  display: true,
  pin: false,
  isMainContent: false,
  language: "",
  category: "",
};

const addDataValidDefault = {
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
  image: false,
};
const thumbnailDefault = {
  thumbnail: true,
  src: "",
  file: null,
  name: null,
  remove: false,
};
const url = window.location.origin + "/";

/* Export Component */
const ModalAddPortfolio = (props) => {
  const { t } = useTranslation("portfolio-page");
  const { isOpen, menuList, portfoliosList, category, totalData } = props;
  const language = useSelector((state) => state.app.language);
  const isSuperAdmin = useSelector(
    (state) => state.auth.userPermission.superAdmin
  );
  const [addData, setAddData] = useState(addDataDefault);
  const [addDataValid, setAddDataValid] = useState(addDataValidDefault);
  const [previews, setPreviews] = useState(thumbnailDefault);
  const [moreImage, setMoreImage] = useState([]);
  const [checkboxList, setCheckBoxList] = useState([]);
  const [ckValue, setCkValue] = useState("");
  const [displayDate, setDisplayDate] = useState(null);
  const [hiddenDate, setHiddenDate] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [radioResult, setRadioResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setHiddenDate(null);
      setDisplayDate(null);
      setCkValue("");
      setAddData({ ...addDataDefault, priority: totalData + 1 });
      setAddDataValid(addDataValidDefault);
      setPreviews(thumbnailDefault);
      setMoreImage([]);

      const result = category.map((d) => {
        return { ...d, checked: false };
      });
      setCheckBoxList(result);
    }
  }, [isOpen]);

  const setPreviewHandler = (data) => {
    if (data.file) {
      setAddData({ ...addData, thumbnail_name: data.file.name });
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
        index: moreImage.length,
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
          m.name = data.file.name;
        }
        return m;
      });
      setMoreImage(result);
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

  const saveModalHandler = () => {
    const cateListId = checkboxList
      .filter((f) => f.checked)
      .reduce((o, n) => o + n.id + ",", ",");
    /* Validator */
    setAddDataValid({
      ...addDataValid,
      title: addData.title === "",
      description: addData.description === "",
      address: addData.address === "",
      size: addData.size === "",
      status: addData.status === "",
      slug: addData.slug === "",
      // category: radioResult === null,
    });

    if (
      addData.title === "" ||
      addData.description === "" ||
      addData.address === "" ||
      addData.size === "" ||
      addData.status === "" ||
      // radioResult === null ||
      isFetching
    ) {
      return false;
    }

    setIsFetching(true);

    /* Prepare Data */
    const formData = new FormData();
    if (previews.file) {
      formData.append("Thumbnail", previews.file);
      formData.append("ThumbnailName", addData.thumbnail_name);
      formData.append("ThumbnailTitle", addData.thumbnail_title);
      formData.append("ThumbnailAlt", addData.thumbnail_alt);
    }
    let moreImageLength = moreImage.length;
    if (moreImageLength > 0) {
      for (let i = 0; i < moreImageLength; i++) {
        if (moreImage[i].index !== undefined) {
          formData.append(`Images[]`, moreImage[i].file);
          formData.append("ImagesName[]", moreImage[i].name);
          formData.append("ImagesTitle[]", moreImage[i].title);
          formData.append("ImagesAlt[]", moreImage[i].alt);
        }
      }
    }

    formData.append("category", radioResult);
    formData.append("isMainContent", addData.isMainContent ? 1 : 0);
    formData.append("title", addData.title);
    formData.append("keyword", addData.keyword);
    formData.append(
      "description",
      addData.description ? addData.description : ""
    );
    formData.append("address", addData.address);
    formData.append("size", addData.size);
    formData.append("status", addData.status);
    formData.append("slug", addData.slug);
    formData.append("topic", addData.topic);
    formData.append("content", ckValue);
    formData.append("redirect", addData.redirect);
    formData.append(
      "display_date",
      displayDate ? moment(displayDate).format() : null
    );
    formData.append(
      "hidden_date",
      hiddenDate ? moment(hiddenDate).format() : null
    );
    formData.append("status_display", addData.display ? 1 : 0);
    formData.append("pin", addData.pin ? 1 : 0);
    formData.append("priority", addData.priority);
    formData.append("language", language);

    /* Fetch Data */
    svCreatePortfolio(formData).then((res) => {
      setIsFetching(false);
      if (res.status) {
        props.setClose(false);
        props.setRefreshData((prev) => prev + 1);
      }
      SwalUI({ status: res.status, description: res.description });
    });
  };

  console.log(radioResult);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Modal
        open={isOpen}
        onClose={() => props.setClose(false)}
        className={"modal-add-portfolio"}
        aria-labelledby="modal-add-portfolio"
        aria-describedby="modal-add-portfolio"
      >
        <Box className="modal-custom">
          <div className="modal-header">
            <h2>
              <FontAwesomeIcon icon={faAdd} />
              <span>{t("เพิ่มผลงาน")}</span>
            </h2>
            <IconButton
              className="param-generator"
              color="error"
              sx={{ p: "10px" }}
              onClick={() => props.setClose(false)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </div>
          <div className="modal-body overflow-scroll-custom">
            <fieldset className="modal-fieldset">
              <legend className="modal-legend">
                {t("ModalAddPortfolioTitle")}
              </legend>
              <div style={{ width: "100%" }} className="form-details">
                <FieldsetUI className="image-setting" label={t("ข้อมูลรูปภาพ")}>
                  <PreviewImageUI
                    className="add-image"
                    previews={previews}
                    setPreviews={setPreviewHandler}
                    style={{ border: addDataValid.image && "1px solid red" }}
                  />

                  <div className="image-detail">
                    {/* <TextField
                      onChange={(e) =>
                        setAddData((prevState) => {
                          return { ...prevState, thumbnail_name: e.target.value }
                        })
                      }
                      value={addData.thumbnail_name}
                      className="text-field-custom"
                      fullWidth={true}
                      error={addDataValid.thumbnail_name}
                      id="image-name"
                      label="Image name"
                      size="small"
                    /> */}
                    <TextField
                      onChange={(e) =>
                        setAddData((prevState) => {
                          return {
                            ...prevState,
                            thumbnail_title: e.target.value,
                          };
                        })
                      }
                      value={addData.thumbnail_title}
                      className="text-field-custom"
                      fullWidth={true}
                      error={addDataValid.thumbnail_title}
                      id="image-title"
                      label="Image title"
                      size="small"
                    />
                    <TextField
                      onChange={(e) =>
                        setAddData((prevState) => {
                          return {
                            ...prevState,
                            thumbnail_alt: e.target.value,
                          };
                        })
                      }
                      value={addData.thumbnail_alt}
                      className="text-field-custom"
                      fullWidth={true}
                      error={addDataValid.thumbnail_alt}
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
                        className="add-more-image"
                        previews={{
                          src: m.src,
                          file: m.file,
                          index,
                          remove: true,
                        }}
                        setPreviews={setMoreImagePreviewHandler}
                      />
                      <div className="image-detail">
                        {/* <TextField
                          onChange={(e) =>
                            changeMoreImageData(index, {
                              ...m,
                              name: e.target.value,
                            })
                          }
                          value={m.name}
                          className="text-field-custom"
                          fullWidth={true}
                          id={`image-name-${index}`}
                          label={`Image Name ${index + 1}`}
                          size="small"
                        /> */}
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
                          error={addDataValid.thumbnail_title}
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
                          error={addDataValid.thumbnail_alt}
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
                      className="add-image"
                      previews={{ src: "", file: "", remove: false }}
                      setPreviews={addMoreImage}
                    />
                  </div>
                </FieldsetUI>
                <h3 className="portfolio-detail-title">{t("รายละเอียด")}</h3>
                <TextField
                  onChange={(e) =>
                    setAddData((prevState) => {
                      return { ...prevState, title: e.target.value };
                    })
                  }
                  value={addData.title}
                  className="text-field-custom"
                  fullWidth={true}
                  error={addDataValid.title}
                  id="cate-title"
                  label="Title"
                  size="small"
                />
                {/* <TextField
                  onChange={(e) =>
                    setAddData((prevState) => {
                      return { ...prevState, keyword: e.target.value }
                    })
                  }
                  value={addData.keyword}
                  className="text-field-custom"
                  fullWidth={true}
                  error={addDataValid.keyword}
                  id="cate-keyword"
                  label="Keyword"
                  size="small"
                /> */}
                <TextField
                  onChange={(e) =>
                    setAddData((prevState) => {
                      return { ...prevState, description: e.target.value };
                    })
                  }
                  value={addData.description}
                  className="text-field-custom"
                  fullWidth={true}
                  error={addDataValid.description}
                  id="cate-description"
                  label="Description"
                  size="small"
                />
                <TextField
                  onChange={(e) =>
                    setAddData((prevState) => {
                      return { ...prevState, address: e.target.value };
                    })
                  }
                  value={addData.address}
                  className="text-field-custom"
                  fullWidth={true}
                  error={addDataValid.address}
                  id="cate-address"
                  label="Address"
                  size="small"
                />
                <TextField
                  onChange={(e) =>
                    setAddData((prevState) => {
                      return { ...prevState, size: e.target.value };
                    })
                  }
                  value={addData.size}
                  className="text-field-custom"
                  fullWidth={true}
                  error={addDataValid.size}
                  id="cate-size"
                  label="Size"
                  size="small"
                />
                <TextField
                  onChange={(e) =>
                    setAddData((prevState) => {
                      return { ...prevState, status: e.target.value };
                    })
                  }
                  value={addData.status}
                  className="text-field-custom"
                  fullWidth={true}
                  error={addDataValid.status}
                  id="cate-status"
                  label="Status"
                  size="small"
                />
                {/* <TextField
                  onChange={(e) =>
                    setAddData((prevState) => {
                      return { ...prevState, slug: e.target.value }
                    })
                  }
                  placeholder="slug/example"
                  value={addData.slug}
                  className="text-field-custom"
                  fullWidth={true}
                  error={addDataValid.slug}
                  id="cate-url"
                  label={url}
                  size="small"
                /> */}
                {/* <TextField
                  onChange={(e) =>
                    setAddData((prevState) => {
                      return { ...prevState, topic: e.target.value }
                    })
                  }
                  placeholder="Topic Name"
                  value={addData.topic}
                  className="text-field-custom"
                  fullWidth={true}
                  error={addDataValid.topic}
                  id="inp-topic"
                  label="Topic"
                  size="small"
                /> */}
                <div style={{ marginTop: "1rem" }} className="ck-content">
                  {/* <label className="ck-add-portfolio">Content</label> */}
                  <CKeditorComponent
                    ckNameId="ck-add-portfolio"
                    value={ckValue}
                    onUpdate={setCkValue}
                  />
                </div>
                {/* <TextField
                  onChange={(e) =>
                    setAddData((prevState) => {
                      return { ...prevState, redirect: e.target.value }
                    })
                  }
                  placeholder="Link Url"
                  value={addData.redirect}
                  className="text-field-custom"
                  fullWidth={true}
                  error={addDataValid.redirect}
                  id="cate-redirect"
                  label="Redirect"
                  size="small"
                /> */}

                <div className="input-date">
                  <div className="input-half pr">
                    <DateTimePicker
                      className="date-input"
                      size="small"
                      label={t("Display Date")}
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

                <h3 className="portfolio-detail-title">{t("การแสดงผล")}</h3>
                <div className="setting-controls">
                  <div className="switch-form">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={(e) =>
                              setAddData({
                                ...addData,
                                display: e.target.checked,
                              })
                            }
                            checked={addData.display}
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
                              setAddData({ ...addData, pin: e.target.checked })
                            }
                            checked={addData.pin}
                          />
                        }
                        label={t("ปักหมุด")}
                        labelPlacement="start"
                      />
                    </FormGroup>
                  </div>
                  {/* {isSuperAdmin && (
                    <div className="switch-form">
                      <FormGroup>
                        <FormControlLabel  control={<Switch onChange={(e) => setAddData({...addData, isMainContent: e.target.checked})} checked={addData.isMainContent} /> }   label="Main Content" labelPlacement="start" />
                      </FormGroup>
                    </div>
                  )} */}

                  {/* <div className="input-group">
                    <div className="inp"> 
                      <ButtonUI
                        color="error"
                        onClick={(e) => (addData.priority > 1)?setAddData({...addData, priority: addData.priority - 1}):""} >
                        <FontAwesomeIcon icon={faMinus} />
                      </ButtonUI>
                      <span className="title">
                        {t("ความสำคัญ")} {addData.priority}
                      </span>
                      <ButtonUI onClick={(e) => setAddData({...addData, priority: addData.priority + 1}) }>
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
              {t("บันทึก")}
            </ButtonUI>
            <ButtonUI
              className="btn-cancel"
              on="cancel"
              width="md"
              onClick={() => props.setClose(false)}
            >
              {t("ยกเลิก")}
            </ButtonUI>
          </div>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default ModalAddPortfolio;
