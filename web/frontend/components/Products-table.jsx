import {
  TextField,
  IndexTable,
  LegacyCard,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Text,
  ChoiceList,
  RangeSlider,
  Badge,
  Avatar,
  Thumbnail,
} from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';

function IndexFiltersDefaultExample(props) {
  const [resp, setResp] = useState([]);

  useEffect(() => {
    if (props.products.length > 0) {
      setResp(props.products);
    }
  }, [props.products])

  var product = props.products
  const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const [itemStrings, setItemStrings] = useState([
    // 'All',
    // 'Unpaid',
    // 'Open',
    // 'Closed',
    // 'Local delivery',
    // 'Local pickup',
  ]);
  const deleteView = (index) => {
    const newItemStrings = [...itemStrings];
    newItemStrings.splice(index, 1);
    setItemStrings(newItemStrings);
    setSelected(0);
  };

  const duplicateView = async (name) => {
    setItemStrings([...itemStrings, name]);
    setSelected(itemStrings.length);
    await sleep(1);
    return true;
  };

  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => { },
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
          {
            type: 'rename',
            onAction: () => { },
            onPrimaryAction: async (value) => {
              const newItemsStrings = tabs.map((item, idx) => {
                if (idx === index) {
                  return value;
                }
                return item.content;
              });
              await sleep(1);
              setItemStrings(newItemsStrings);
              return true;
            },
          },
          {
            type: 'duplicate',
            onPrimaryAction: async (value) => {
              await sleep(1);
              duplicateView(value);
              return true;
            },
          },
          {
            type: 'edit',
          },
          {
            type: 'delete',
            onPrimaryAction: async () => {
              await sleep(1);
              deleteView(index);
              return true;
            },
          },
        ],
  }));
  const [selected, setSelected] = useState(0);
  const onCreateNewView = async (value) => {
    await sleep(500);
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length);
    return true;
  };


  const sortOptions = [
    // {label: 'Order', value: 'order asc', directionLabel: 'Ascending'},
    // {label: 'Order', value: 'order desc', directionLabel: 'Descending'},
    // {label: 'Customer', value: 'customer asc', directionLabel: 'A-Z'},
    // {label: 'Customer', value: 'customer desc', directionLabel: 'Z-A'},
    // {label: 'Date', value: 'date asc', directionLabel: 'A-Z'},
    // {label: 'Date', value: 'date desc', directionLabel: 'Z-A'},
    // {label: 'Total', value: 'total asc', directionLabel: 'Ascending'},
    // {label: 'Total', value: 'total desc', directionLabel: 'Descending'},
  ];
  const [sortSelected, setSortSelected] = useState(['order asc']);
  const { mode, setMode } = useSetIndexFiltersMode();
  const onHandleCancel = () => { };

  const onHandleSave = async () => {
    await sleep(1);
    return true;
  };

  const primaryAction =
    selected === 0
      ? {
        type: 'save-as',
        onAction: onCreateNewView,
        disabled: false,
        loading: false,
      }
      : {
        type: 'save',
        onAction: onHandleSave,
        disabled: false,
        loading: false,
      };
  const [accountStatus, setAccountStatus] = useState(
    undefined,
  );
  const [moneySpent, setMoneySpent] = useState(
    undefined,
  );
  const [taggedWith, setTaggedWith] = useState('');
  // const [queryValue, setQueryValue] = useState('');

  const handleAccountStatusChange = useCallback(
    (value) => setAccountStatus(value),
    [],
  );
  const handleMoneySpentChange = useCallback(
    (value) => setMoneySpent(value),
    [],
  );
  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    [],
  );
  const handleFiltersQueryChange = useCallback(
    (value) => {
      props.setCurrentPage(1);
      props.setQueryValue(value);
      let arr = props.products?.length > 0 && props.products?.filter((item) =>
        item.title.toLowerCase().includes(value.toLowerCase())
      );
      setResp(arr);
    },
    [],
  );
  const handleAccountStatusRemove = useCallback(
    () => setAccountStatus(undefined),
    [],
  );
  const handleMoneySpentRemove = useCallback(
    () => setMoneySpent(undefined),
    [],
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(''), []);
  const handleQueryValueRemove = useCallback(() => props.setQueryValue(''), []);
  const handleFiltersClearAll = useCallback(() => {
    handleAccountStatusRemove();
    handleMoneySpentRemove();
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [
    handleAccountStatusRemove,
    handleMoneySpentRemove,
    handleQueryValueRemove,
    handleTaggedWithRemove,
  ]);

  const filters = [
    {
      key: 'accountStatus',
      label: 'Account status',
      filter: (
        <ChoiceList
          title="Account status"
          titleHidden
          choices={[
            { label: 'Enabled', value: 'enabled' },
            { label: 'Not invited', value: 'not invited' },
            { label: 'Invited', value: 'invited' },
            { label: 'Declined', value: 'declined' },
          ]}
          selected={accountStatus || []}
          onChange={handleAccountStatusChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: 'taggedWith',
      label: 'Tagged with',
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
    },
    {
      key: 'moneySpent',
      label: 'Money spent',
      filter: (
        <RangeSlider
          label="Money spent is between"
          labelHidden
          value={moneySpent || [0, 500]}
          prefix="$"
          output
          min={0}
          max={2000}
          step={1}
          onChange={handleMoneySpentChange}
        />
      ),
    },
  ];

  const appliedFilters = [];
  if (accountStatus && !isEmpty(accountStatus)) {
    const key = 'accountStatus';
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, accountStatus),
      onRemove: handleAccountStatusRemove,
    });
  }
  if (moneySpent) {
    const key = 'moneySpent';
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, moneySpent),
      onRemove: handleMoneySpentRemove,
    });
  }
  if (!isEmpty(taggedWith)) {
    const key = 'taggedWith';
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, taggedWith),
      onRemove: handleTaggedWithRemove,
    });
  }

  const orders = [
    {
      image: '1020',
      name: (
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          #1020
        </Text>
      ),
      price: 'Jul 20 at 4:34pm',
      // customer: 'Jaydon Stanton',
      // total: '$969.44',
      quantity: <Badge progress="complete">Paid</Badge>,
      // fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    },
    {
      image: '1019',
      name: (
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          #1019
        </Text>
      ),
      price: 'Jul 20 at 3:46pm',
      // customer: 'Ruben Westerfelt',
      // total: '$701.19',
      quantity: <Badge progress="partiallyComplete">Partially paid</Badge>,
      // fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    },
    {
      image: '1018',
      name: (
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          #1018
        </Text>
      ),
      price: 'Jul 20 at 3.44pm',
      // customer: 'Leo Carder',
      // total: '$798.24',
      quantity: <Badge progress="complete">Paid</Badge>,
      // fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    },
  ];
  const resourceName = {
    singular: 'order',
    plural: 'orders',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(resp);
  const rowMarkup = resp?.length > 0 && resp.map(
    (
      item,
      index,
    ) => {

      let total = 0;
      let price = 0;

      item.variants.forEach(element => {
        total += element.inventory_quantity;
        price += Number(element.price);
      });


      return (
        <IndexTable.Row
          id={item.id}
          key={item.id}
          selected={selectedResources.includes(item.id)}
          position={index}
        >
          <IndexTable.Cell>
            <div className=''>
              {!!item.image ? <img src={item.image.src} alt="" style={{ width: 50, height: 50 }} /> : <Thumbnail
                source="https://burst.shopifycdn.com/photos/black-leather-choker-necklace_373x@2x.jpg"
                alt="Black choker necklace"
                size='small'
              />}
            </div>
          </IndexTable.Cell>
          {/* <IndexTable.Cell>{name}</IndexTable.Cell> */}
          {/* <IndexTable.Cell>{image}</IndexTable.Cell> */}
          <IndexTable.Cell>{item.title}</IndexTable.Cell>
          <IndexTable.Cell>{price.toFixed(2)}</IndexTable.Cell>
          <IndexTable.Cell>{total}</IndexTable.Cell>
        </IndexTable.Row>
      )
    },
  );

  return (
    <LegacyCard>
      <IndexFilters
        sortOptions={sortOptions}
        sortSelected={sortSelected}
        queryValue={props.queryValue}
        queryPlaceholder="Searching in all"
        onQueryChange={handleFiltersQueryChange}
        onQueryClear={() => props.setQueryValue('')}
        onSort={setSortSelected}
        primaryAction={primaryAction}
        cancelAction={{
          onAction: onHandleCancel,
          disabled: false,
          loading: false,
        }}
        tabs={tabs}
        selected={selected}
        onSelect={setSelected}
        canCreateNewView
        onCreateNewView={onCreateNewView}
        filters={filters}
        appliedFilters={appliedFilters}
        onClearAll={handleFiltersClearAll}
        mode={mode}
        setMode={setMode}
      />
      <IndexTable
        resourceName={resourceName}
        itemCount={orders.length}
        selectedItemsCount={
          allResourcesSelected ? 'All' : selectedResources.length
        }
        selectable={false}
        onSelectionChange={handleSelectionChange}
        headings={[
          { title: 'Image' },
          { title: 'Name' },
          { title: 'Price' },
          // {title: 'Total', alignment: 'end'},
          { title: 'Quantity' },
          // {title: 'Fulfillment status'},
        ]}
      >
        {rowMarkup}
      </IndexTable>
    </LegacyCard>
  );

  function disambiguateLabel(key, value) {
    switch (key) {
      case 'moneySpent':
        return `Money spent is between $${value[0]} and $${value[1]}`;
      case 'taggedWith':
        return `Tagged with ${value}`;
      case 'accountStatus':
        return (value).map((val) => `Customer ${val}`).join(', ');
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === '' || value == null;
    }
  }
}


export default IndexFiltersDefaultExample;