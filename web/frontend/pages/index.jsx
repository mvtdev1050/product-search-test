import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
  Button,
  HorizontalStack,
  Pagination,
  VerticalStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";

import { trophyImage } from "../assets";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { ProductsCard } from "../components/ProductsCard";
import IndexFiltersDefaultExample from "../components/Products-table";
import { useEffect, useMemo, useState } from "react";
import Placeholder from "../assets/placeholder.webp";

const PageSize = 8;

export default function HomePage() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [queryValue, setQueryValue] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [selectedFilter, setSelectedFilter] = useState("");
    const fetch = useAuthenticatedFetch();
  const [Pdata, setData] = useState({});

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "api/products&limit=250",
    reactQueryOptions: {
      onSuccess: (data) => {
        // setIsLoading(false);
        setData(data.data)
      },
      onError: (error) => {
        console.log(error)
      }
    },
  });

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return Pdata.length > 0 && Pdata
        ?.filter((item) =>
        queryValue === ""
                ? item.status
                      .toLowerCase()
                      .includes(selectedFilter.toLowerCase())
                : (item.title
                      .toLowerCase()
                      .includes(queryValue.toLowerCase()))
        )
        .slice(firstPageIndex, lastPageIndex);
}, [currentPage, Pdata, queryValue, selectedFilter]);

useEffect(() => {
  const totalPagesRounded = Math.ceil(Pdata?.length / PageSize);
  if (totalPagesRounded === 0) {
      setTotalPages(1);
  } else {
      setTotalPages(Math.ceil(Pdata?.length / PageSize));
  }
}, [Pdata]);

const onNext = () => {
  setCurrentPage(currentPage + 1);
};

const onPrevious = () => {
  setCurrentPage(currentPage - 1);
};


  console.log('Pdata', Pdata)
  console.log("setIsLoading(!isLoading)}", isLoading);
  return (
    <Page>
      <TitleBar title={t("HomePage.title")} primaryAction={null} />
      <Layout>
        <Layout.Section>
          {!isLoading && <Card sectioned>
            <Stack
              wrap={false}
              spacing="extraTight"
              distribution="trailing"
              alignment="center"
            >
              <Stack.Item fill>
              <HorizontalStack align="center">
              <div style={{ padding: "0 20px", width: "220px" }}>
                  {/* <Image
                    source={trophyImage}
                    alt={t("HomePage.trophyAltText")}
                    width={120}
                  /> */}
                  <img style={{width: "100%"}} src={Placeholder} alt="" />
                </div>  
                </HorizontalStack>
                <TextContainer spacing="loose">
                  <Text as="h2" variant="headingMd" alignment="center">
                    {t("HomePage.heading")}
                  </Text>
                  <p>
                  </p>
                  <div style={{marginBottom: "40px"}}>
                  <HorizontalStack align="center">
                    <Button primary  onClick={() => {setIsLoading(!isLoading); setCurrentPage(1)}}>
                      Show Products
                    </Button>
                  </HorizontalStack>
                  </div>
                </TextContainer>
              

              </Stack.Item>
            </Stack>

          </Card>}
          {isLoading && <Button
            primary
            onClick={() => setIsLoading(!isLoading)}
          >
            Back
          </Button>}
        </Layout.Section>
        <Layout.Section>
          {/* <ProductsCard /> */}
          {isLoading && <VerticalStack gap={"5"}> <IndexFiltersDefaultExample products={currentTableData} isLoading={isLoading} queryValue={queryValue} setQueryValue={setQueryValue} setCurrentPage={setCurrentPage} />
          <HorizontalStack align="center">
            <div style={{marginBottom: "20px"}}>
          <Pagination
              label={``}
              hasPrevious={currentPage > 1}
              onPrevious={() => {
                  onPrevious();
              }}
              hasNext={totalPages > currentPage}
              onNext={() => {
                  onNext();
              }}
          />
          </div>
          </HorizontalStack>
          </VerticalStack>}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
