import Link from "next/link";
import { useState, useEffect } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { CameraEnhance, Person } from "@mui/icons-material";
import { Avatar, Box, Button, Grid, TextField, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Card1 from "components/Card1";
import { FlexBox } from "components/flex-box";
import UserDashboardHeader from "components/header/UserDashboardHeader";
import CustomerDashboardLayout from "components/layouts/customer-dashboard";
import CustomerDashboardNavigation from "components/layouts/customer-dashboard/Navigations";
import DropZone from "components/DropZone";
import axios from "axios";
import { H5 } from "components/Typography";
import QRCode from 'react-qr-code';

// ===========================================================
const ProfileEditor = () => {
  let linkArr;
  if (process.browser) {
    const link = document.location.pathname;
    linkArr = link.split("/").slice(-1);
  }

  const [data, setData] = useState(null);
  const [confirmCode, setConfirmCode] = useState('');
  const [sellStatus, setSellStatus] = useState('');
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://i9nwbiqoc6.execute-api.ap-northeast-2.amazonaws.com/test/trade/${linkArr}`
    )
      .then((res) => res.json())
      .then((data) => {
        setData(data[0]);
        setSellStatus(data[0].sell_state)
        if (data[0].confirm_code) {
          setConfirmCode(data[0].confirm_code)
        }
        console.log(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
  }, [confirmCode, sellStatus]);

  const checkoutSchema = yup.object().shape({
    title: yup.string().required("책 제목을 입력하세요."),
    sell_price: yup.string().required("가격을 입력하세요."),
  });

  const handleFormSubmit = async (values) => {
    console.log(values);
    postNewBook(values)
  }; // SECTION TITLE HEADER LINK

  const postNewBook = async (values) => {
    await axios
      .put(
        `https://i9nwbiqoc6.execute-api.ap-northeast-2.amazonaws.com/test/trade`,
        {
          isbn: null,
          title: values.title,
          author: null,
          image: null,
          price: null,
          description: null,
          publisher: null,
          pubdate: null,
          seller_uid: 26,
          sell_price: parseInt(values.sell_price),
          shop_uid: null,
          trade_description: values.trade_description,
          trade_image: null,
          trade_uid: data.trade_uid
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createConfirm = async () => {
    await axios
      .put(
        `https://i9nwbiqoc6.execute-api.ap-northeast-2.amazonaws.com/test/trade`,
        {
          create_confirm: true,
          trade_uid: data.trade_uid
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setConfirmCode(response.data)
          setSellStatus('예약중')
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const HEADER_LINK = (
    <Link href="/my">
      <Button
        color="primary"
        sx={{
          px: 4,
          bgcolor: "primary.light",
        }}
      >
        돌아가기
      </Button>
    </Link>
  ); // Show a loading state when the fallback is rendered

  return (
    <CustomerDashboardLayout>
      {/* TITLE HEADER AREA */}
      <UserDashboardHeader
        icon={Person}
        title="내 책 수정"
        button={HEADER_LINK}
        navigation={<CustomerDashboardNavigation />}
      />

      {/* PROFILE EDITOR FORM */}
      <Card1>

        {data ?
          <Formik
            onSubmit={handleFormSubmit}
            enableReinitialize={true}
            initialValues={{
              title: data.title ? data.title : "",
              sell_price: data.sell_price ? data.sell_price : "",
              trade_description: data.trade_description ? data.trade_description : "",
              sell_state: data.sell_state ? data.sell_state : '',
              image: data.image ? data.image : "/assets/images/products/24.Revel2020.png"

            }}
            validationSchema={checkoutSchema}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <Stack spacing={3} mb={3}>
                  <Grid container spacing={3}>
                    <Grid item md={6} xs={12} style={{ textAlign: 'center' }}>
                      <img
                        name="image"
                        src={values.image}
                        style={{
                          width: '200px', objectFit: 'contain', margin: '0 auto'
                        }}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        style={{
                          marginBottom: '1rem'
                        }}
                        disabled={values.sell_state !== '등록대기'}
                        fullWidth
                        name="title"
                        label="책 제목"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.title}
                        error={!!touched.title && !!errors.title}
                        helperText={touched.title && errors.title}
                      />

                      <TextField
                        fullWidth
                        style={{
                          marginBottom: '1rem'
                        }}
                        disabled={values.sell_state !== '등록대기'}
                        label="판매가"
                        name="sell_price"
                        onBlur={handleBlur}
                        value={values.sell_price}
                        onChange={handleChange}
                        error={!!touched.sell_price && !!errors.sell_price}
                        helperText={touched.sell_price && errors.sell_price}
                      />

                      {values.sell_state === '판매중' && confirmCode === '' ? (
                        <Button fullWidth onClick={createConfirm} variant="contained" color="primary">
                          예약확인증 발급
                        </Button>
                      ) : <></>
                      }

                      {values.sell_state !== '판매완료' && confirmCode !== '' ? (
                        <>
                          <p>구매자에게 아래 예약번호를 공유해주세요.</p>
                          <p>{confirmCode}</p>
                          <QRCode value={confirmCode} />
                        </>
                      ) : <></>
                      }

                    </Grid>

                    <Grid item md={12} xs={12}>
                      <TextField
                        rows={6}
                        multiline
                        fullWidth
                        color="info"
                        size="medium"
                        name="trade_description"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.trade_description}
                        label="책소개"
                        error={Boolean(errors.trade_description && touched.trade_description)}
                        helperText={touched.trade_description && errors.trade_description}
                      />
                    </Grid>
                    {/* <Grid item md={12} xs={12}>
                      <DropZone
                        onChange={(files) => console.log(files)}
                        title="상품 이미지를 등록하세요"
                      // imageSize="We had to limit height to maintian consistancy. Some device both side of the banner might cropped for height limitation."
                      />
                    </Grid> */}
                  </Grid>
                </Stack>

                {sellStatus === '판매중' && (
                  <Button type="submit" variant="contained" color="primary">
                    저장
                  </Button>
                )}

              </form>
            )}
          </Formik> : <H5>Loading...</H5>}

      </Card1>
    </CustomerDashboardLayout>
  );
};

export default ProfileEditor;
