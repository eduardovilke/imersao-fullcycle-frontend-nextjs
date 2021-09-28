import {
  Column,
  IntegratedFiltering,
  IntegratedPaging,
  PagingState,
  SearchState,
  SortingState,
} from "@devexpress/dx-react-grid";
import { Container, Typography, Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import {
  Grid,
  PagingPanel,
  SearchPanel,
  Table,
  TableHeaderRow,
  Toolbar,
} from "@devexpress/dx-react-grid-material-ui";
import { GetServerSideProps, NextPage } from "next";
import { Token, validateAuth } from "../../utils/auth";
import makeHttp, { http } from "../../utils/http";
import { Transaction } from "../../utils/model";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/router";

interface TransactionsPageProps {
  transactions: Transaction[];
}

const columns: Column = [
  {
    name: 'payment_date',
    title: 'Data pag.',
    getCellValue: (row: any, columnName: string) => {
      return format(parseISO(row[columnName].slice(0, 10)), "dd/MM/yyyy");
    },
  },
  {
    name: 'name',
    title: 'Nome'
  },
  {
    name: 'category',
    title: 'Categoria'
  },
  {
    name: 'type',
    title: 'Operação'
  },
  {
    name: 'created_at',
    title: 'Criado em',
    getCellValue: (row: any, columnName: string) => {
      return format(parseISO(row[columnName].slice(0, 10)), "dd/MM/yyyy");
    },
  },
];

const TransactionsPage: NextPage<TransactionsPageProps> = (props) => {
  const router = useRouter();
  return (
    <Container>
      <Typography component="h1" variant="h4">
        Minhas Transações
      </Typography>
      <Button
        startIcon={<AddIcon />}
        variant={"contained"}
        color="primary"
        onClick={() => router.push("/transactions/new")}
      />
      <Grid rows={props.transactions} columns={columns}>
        <Table />
        <SortingState 
          defaultSorting={[{columnName: 'created_at', direction: 'desc'}]} 
        />
        <PagingState defaultCurrentPage={0} pageSize={5} />
        <SearchState defaultValue="Conta de luz"/>
        <TableHeaderRow showSortingControls/>
        <IntegratedFiltering />
        <Toolbar />
        <SearchPanel />
        <PagingPanel />
        <IntegratedPaging />
      </Grid>
    </Container>
  );
};

export default TransactionsPage;

export const getServerSideProps: GetServerSideProps = async(ctx) => {
  const auth = validateAuth(ctx.req);
  if(!auth){
    return {
      redirect: {
        permanent: false,
        destination: '/login'
      },
    }
  }

  const token = (auth as Token).token;

  const { data: transactions } = await makeHttp(token).get('transactions')

  return {
    props:{
      transactions
    }
  }
};