import { Box, Grid } from "@mui/material";
import ProductCard1 from "components/product-cards/ProductCard1";
import { H2, H3 } from "components/Typography";
import { useState, useEffect } from "react";

// ===================================================
const RelatedProducts = ({ data }) => {

  return (
    <Box mb={7.5}>
      <H3 mb={3}>동일 상품</H3>
      <Grid container spacing={8}>
        {data ? data.map((item, ind) => (
          <Grid item lg={3} md={3} sm={6} xs={12} key={ind}>
            <ProductCard1
              trade_id={item.trade_id}
              title={item.title}
              sell_price={item.sell_price}
              rating={item.rating}
              imgUrl={item.image}
              shop_name={item.shop_name}
              discount={item.discount}
              hoverEffect
            />
          </Grid>
        )) : <H2>Loading...</H2>}
      </Grid>
    </Box>
  );
};

export default RelatedProducts;
