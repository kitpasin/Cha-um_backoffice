import React, { useEffect, useState } from "react";
import HeadPageComponent from "../../components/layout/headpage/headpage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faRedo } from "@fortawesome/free-solid-svg-icons";
import { t } from "i18next";
import ContentFormatButton from "../../components/ui/toggle-format/toggle-format";
import ButtonUI from "../../components/ui/button/button";
import {
  svDeleteMessageByToken,
  svGetMessages,
} from "../../services/message.service";
import {
  Autocomplete,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  tableCellClasses,
} from "@mui/material";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "../../store/app-slice";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SwalUI from "../../components/ui/swal-ui/swal-ui";
const modalSwal = withReactContent(Swal);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    borderRight: "1px solid #fff ",
    color: "#fff",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderRight: "1px solid #fff",
    backgroundColor: "#e5e7eb",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "",
  },
}));

function MessagePage() {
  const isSuerperAdmin = useSelector(
    (state) => state.auth.userPermission.superAdmin
  );
  const dispatch = useDispatch();
  const [isRowDisplay, setIsRowDisplay] = useState(false);
  const [refreshData, setRefreshData] = useState(0);
  const [messageData, setMessageData] = useState([]);
  const [selectedName, setSelectedName] = useState("")

  const [filteredData, setFilteredData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [limited, setLimited] = useState({ begin: 0, end: rowsPerPage });
  

  useEffect(() => {
    setMessageData([]);
    dispatch(appActions.isSpawnActive(true));
    svGetMessages().then((res) => {
      if (res.status) {
        setMessageData(res.data);
      }
      dispatch(appActions.isSpawnActive(false));
    });
  }, [refreshData]);

  useEffect(() => {
    if (messageData.length > 0) {
      setTotalData(messageData.length);
      setFilteredData(messageData.slice(limited.begin, limited.end));
    }
  }, [page, rowsPerPage, messageData]);

  /* Pagination */
  const handleChangePage = (event, newPage) => {
    setLimited({
      begin: newPage * rowsPerPage,
      end: (newPage + 1) * rowsPerPage,
    });
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    let rowPage = parseInt(event.target.value, 10);
    setRowsPerPage(rowPage);
    setLimited({ begin: 0, end: rowPage });
    setPage(0);
  };

  const deleteHandler = (data) => {
    modalSwal
      .fire({
        icon: "warning",
        title: "Delete Letter",
        text: `Do you want to delete letter from "${data.name}" ?`,
        confirmButtonText: "Yes, delete it",
        confirmButtonColor: "#e11d48",
        showCancelButton: true,
        cancelButtonText: "Cancel",
      })
      .then((result) => {
        if (result.isConfirmed) {
          svDeleteMessageByToken(data.id).then((res) => {
            SwalUI({ status: res.status, description: res.description });
            if (res.status) {
              setRefreshData(refreshData + 1);
            }
          });
        }
      });
  };

  const letters = filteredData.filter((data) => {
    const matchesName = selectedName ? data.name === selectedName : true;
    return matchesName; 
  })

  console.log(selectedName);
  return (
    <section id="post-page">
      <HeadPageComponent
        h1={t("จดหมาย")}
        icon={<FontAwesomeIcon icon={faEnvelope} />}
        breadcrums={[{ title: t("จดหมาย"), link: false }]}
      />
      <div className="card-control fixed-width">
        <div style={{ paddingBottom: "0.5rem" }} className="card-head">
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
          </div>
          <Autocomplete
              disablePortal
              options={messageData.map((data) => data.name)}
              onChange={(e, newValue) => {
                const name = messageData.find(
                  (data) => data.name === newValue
                );
                setSelectedName(
                  name ? newValue : null
                );
              }}
              sx={{ width: 300, marginTop: "1rem" }}
              size="small"
              renderInput={(params) => (
                <TextField {...params} label="ชื่อ" />
              )}
            />
        </div>
        <div style={{ padding: "0.75rem" }}>
          <div style={{ paddingInline: "0.5rem" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead
                  style={{
                    background:
                      "linear-gradient(90deg, #343a40 0%, #191919 100%)",
                  }}
                >
                  <TableRow>
                    <StyledTableCell>ชื่อผู้ส่ง</StyledTableCell>
                    <StyledTableCell align="left">อีเมล</StyledTableCell>
                    <StyledTableCell align="left">หัวข้อ</StyledTableCell>
                    <StyledTableCell align="left">ข้อความ</StyledTableCell>
                    <StyledTableCell align="left">วันที่ส่ง</StyledTableCell>
                    {isSuerperAdmin && (
                      <StyledTableCell align="center">ลบจดหมาย</StyledTableCell>
                    )}
                  </TableRow>
                </TableHead>
                {filteredData.length > 0 ? (
                  <TableBody>
                    {letters.map((data, index) => (
                      <StyledTableRow key={data.id}>
                        <StyledTableCell component="th" scope="row">
                          {data.name}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {data.email}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {data.subject}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {data.message}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {data.updated_at}
                        </StyledTableCell>
                        {isSuerperAdmin && (
                          <StyledTableCell
                            align="left"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              gap: "1rem",
                              borderRight: 0,
                            }}
                          >
                            <ButtonUI
                              className="btn-cancel"
                              on="delete"
                              width="md"
                              onClick={() => deleteHandler(data)}
                            >
                              {t("ลบ")}
                            </ButtonUI>
                          </StyledTableCell>
                        )}
                      </StyledTableRow>
                    ))}
                  </TableBody>
                ) : (
                  <TableBody>
                    <StyledTableRow>
                      <StyledTableCell
                        style={{ height: "100px", borderRight: 0 }}
                        colSpan={isSuerperAdmin ? 6 : 5}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "1rem",
                            color: "rgb(75 85 99)",
                          }}
                        >
                          <p style={{ textAlign: "center" }}>ไม่พบจดหมาย</p>
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </div>
          <div style={{ paddingTop: "0.5rem" }}>
            <TablePagination
              component="div"
              count={totalData}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default MessagePage;
