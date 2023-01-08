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


// ===========================================================
const ProfileEditor = () => {
  let linkArr;
  if (process.browser) {
    const link = document.location.pathname;
    linkArr = link.split("/").slice(-1);
    console.log(linkArr);
  }

  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://i9nwbiqoc6.execute-api.ap-northeast-2.amazonaws.com/test/trade/${linkArr}`
    )
      .then((res) => res.json())
      .then((data) => {
        setData(data[0]);
        console.log(data);
        setLoading(false);
      });
  }, []);

  // const INITIAL_VALUES = {
  //   title: data.title? data.title || "",
  //   sell_price: data.sell_price || "",
  //   description: "",
  // };
  const checkoutSchema = yup.object().shape({
    title: yup.string().required("required"),
    sell_price: yup.string().required("required"),
  });

  const handleFormSubmit = async (values) => {
    console.log(values);
    postNewBook(values)
  }; // SECTION TITLE HEADER LINK

  const postNewBook = async (values) => {
    await axios
      .post(
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
          trade_image: null
        }
      )
      .then((response) => {
        console.log(response);
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
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        name="title"
                        label="책 제목"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.title}
                        error={!!touched.title && !!errors.title}
                        helperText={touched.title && errors.title}
                      />
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="판매가"
                        name="sell_price"
                        onBlur={handleBlur}
                        value={values.sell_price}
                        onChange={handleChange}
                        error={!!touched.sell_price && !!errors.sell_price}
                        helperText={touched.sell_price && errors.sell_price}
                      />
                    </Grid>

                    <Grid item md={12} xs={12}>
                      <TextField
                        rows={6}
                        multiline
                        fullWidth
                        color="info"
                        size="medium"
                        name="description"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.trade_description}
                        label="책소개"
                        error={Boolean(errors.trade_description && touched.trade_description)}
                        helperText={touched.trade_description && errors.trade_description}
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <DropZone
                        onChange={(files) => console.log(files)}
                        title="상품 이미지를 등록하세요"
                      // imageSize="We had to limit height to maintian consistancy. Some device both side of the banner might cropped for height limitation."
                      />
                    </Grid>
                  </Grid>
                </Stack>


                <Button type="submit" variant="contained" color="primary">
                  저장
                </Button>
              </form>
            )}
          </Formik> : <H5>Loading...</H5>}

      </Card1>
    </CustomerDashboardLayout>
  );
};

export default ProfileEditor;
