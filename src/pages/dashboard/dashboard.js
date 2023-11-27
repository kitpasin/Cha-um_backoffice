import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import "./dashboard.scss";
import {  faGamepad,faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonUI from "../../components/ui/button/button";
import HeadPageComponent from "../../components/layout/headpage/headpage";
import OrderTable from "./order-tab";
import { getBookingList } from "../../services/booking.service";
import { appActions } from "../../store/app-slice";
import BookingSettings from "./settings";

const DashboardPage = () => {
  const { t } = useTranslation(["dashboard-page"]);
  const language = useSelector(state => state.app.language)
  const dispatch = useDispatch();
  const [refreshData, setRefreshData] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [filteredData, setFIlteredData] = useState([]);
  const [settings, setSettings] = useState({
    numberPeople: 1,
    timesAvailable: "",
    timesAvailableSunday: "",
    timesAvailableThursday: "",
    disabledDay: "",
    disabledDate: "",
    disabledHoliday: ""
  });

  useEffect(() => {
    dispatch(appActions.isSpawnActive(true));
    getBookingList(language).then((res) => {
      console.log(res)
      setSettings({
        numberPeople: res.setting.people_number,
        timesAvailable: res.setting.available_time,
        timesAvailableSunday: res.setting.available_time_sunday,
        timesAvailableThursday: res.setting.available_time_thursday,
        disabledDay:  res.setting.disable_by_day,
        disabledDate:  res.setting.disable_by_date,
        disabledHoliday: res.setting.special_holiday,
      })
      const result = res.data.map((d) => {
        return {
          id: d.id,
          name: d.firstname + " " + d.surname,
          request: d.specific_request,
          bookingDate: d.time_booking,
          amount: d.people_number,
          forgroup: d.forgroup,
          email: d.email,
          phone: d.phone,
          status: d.status,
          created_at: d.created_at,
          updated_at: d.updated_at 
        }
      })

      dispatch(appActions.isSpawnActive(false));
      setOrderData(result);
      setFIlteredData(result);
    });
  }, [language, refreshData]);

    const filterData = () => {
        const filted = orderData.filter((f) => {
            return f
        });
        setFIlteredData(filted);
    }


  return (
    <section id="dashboard-page">
      <HeadPageComponent
        h1={"dashboardPage"}
        icon={<FontAwesomeIcon icon={faGamepad} />}
        breadcrums={[{ title: "dashboardPage", link: false }]}
      />

      <div className="card-control fixed-width">
        <div className="card-head">
          <div className="head-action">
            <h2 className="head-title">
              <ButtonUI
                onClick={() => setRefreshData(refreshData + 1)}
                on="create"
                isLoading={false}
                icon={<FontAwesomeIcon icon={faRedo} />} >
                {t("Fetch")}
              </ButtonUI>
            </h2>
          </div>
        </div>
     
        <div className="card-body">
          <OrderTable
            filteredData={filteredData}
            setRefreshData={() => setRefreshData(refreshData + 1)}
          />
          <BookingSettings setRefreshData={setRefreshData} settings={settings} />
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
