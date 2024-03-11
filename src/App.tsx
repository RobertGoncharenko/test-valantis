import {
   Button,
   Container,
   CssBaseline,
   FormControl,
   InputLabel,
   List,
   ListItem,
   MenuItem,
   Select,
   Stack,
   TextField,
   ThemeProvider,
} from "@mui/material";
import "./App.css";
import theme from "./styles/theme";
import { useCallback, useEffect, useState } from "react";
import { filter, getIds, getItems } from "./api";
import { DEFAULT_LIMIT, FIELDS } from "./constants";
import { Item } from "./types";
import { removeDuplicates, removeItemDuplicates } from "./utils";
import Animations from "./Skeleton";

function App() {
   const [offset, setOffset] = useState(0); // always multiple of PAGE_LIMIT (50)
   const [items, setItems] = useState<Item[]>([]);
   const [loading, setLoading] = useState(false);
   const [searchField, setSearchField] = useState("");
   const [searchValue, setSearchValue] = useState("");

   //handle initial load & page change
   useEffect(() => {
      (async () => {
         setLoading(true);
         const ids = await getIds(offset, DEFAULT_LIMIT);
         const idsWithoutDuplicates = removeDuplicates(ids);
         const items = await getItems(idsWithoutDuplicates);
         const itemsWithoutDuplicates = removeItemDuplicates(items);
         setItems(itemsWithoutDuplicates);
         setLoading(false);
      })();
   }, [offset]);

   //handle search
   const handleSearch = useCallback(() => {
      if (!searchField || !searchValue) return;
      (async () => {
         setLoading(true);
         const ids = await filter(searchField, searchValue);
         const idsWithoutDuplicates = removeDuplicates(ids);
         const items = await getItems(idsWithoutDuplicates);
         const itemsWithoutDuplicates = removeItemDuplicates(items);
         setItems(itemsWithoutDuplicates);
         setLoading(false);
      })();
   }, [searchField, searchValue]);

   return (
      <ThemeProvider theme={theme}>
         <CssBaseline />
         <Container maxWidth="lg">
            <Stack direction="row" spacing={4}>
               <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="field-select">Field</InputLabel>
                  <Select
                     labelId="field-select"
                     label="Field"
                     value={searchField}
                     onChange={(e) => setSearchField(e.target.value)}
                     sx={{ textTransform: "capitalize" }}
                  >
                     {FIELDS.map((field) => (
                        <MenuItem
                           key={field}
                           value={field}
                           sx={{ textTransform: "capitalize" }}
                        >
                           {field}
                        </MenuItem>
                     ))}
                  </Select>
               </FormControl>
               <TextField
                  label="Value"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
               />
               <Button onClick={handleSearch}>Search</Button>
            </Stack>
            {loading ? (
               <Animations />
            ) : (
               <List>
                  {items.map((item) => (
                     <ListItem key={item.id}>
                        {item.id} / {item.product} / {item.price} {item.brand}
                     </ListItem>
                  ))}
               </List>
            )}
            <Stack direction="row" spacing={4}>
               {offset !== 0 && (
                  <Button onClick={() => setOffset(offset - DEFAULT_LIMIT)}>
                     ← Previous
                  </Button>
               )}
               <Button onClick={() => setOffset(offset + DEFAULT_LIMIT)}>
                  Next →
               </Button>
            </Stack>
         </Container>
      </ThemeProvider>
   );
}

export default App;
