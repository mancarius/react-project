import React, { useRef } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';
import { BookTwoTone } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';


const autocompleteService = { current: null };

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

export default function GoogleBooksSearchField() {
    const classes = useStyles();
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);
    const loaded = React.useRef(false);
    const field = useRef(null);

    if (typeof window !== 'undefined' && !loaded.current) {
        loaded.current = true;
    }

    const fetch = React.useMemo(
        () =>
        throttle((request, callback) => {
            
        }, 200),
        [],
    );

    React.useEffect(() => {
        field.current.querySelector('input').focus();
    }, [])

    React.useEffect(() => {
        let active = true;

        if (!autocompleteService.current && window.google) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        }
        if (!autocompleteService.current) {
        return undefined;
        }

        if (inputValue === '') {
        setOptions(value ? [value] : []);
        return undefined;
        }

        fetch({ input: inputValue }, (results) => {
        if (active) {
            let newOptions = [];

            if (value) {
            newOptions = [value];
            }

            if (results) {
            newOptions = [...newOptions, ...results];
            }

            setOptions(newOptions);
        }
        });

        return () => {
        active = false;
        };
    }, [value, inputValue, fetch]);
        
    return <>
        <Autocomplete
            id="google-books-search"
            style={{ width: '100%', maxWidth: 600 }}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            ref={field}
            value={value}
            onChange={(event, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField {...params} label="Search in the library" variant="outlined" fullWidth />
            )}
            renderOption={(option) => {
                const matches = option.structured_formatting.main_text_matched_substrings;
                const parts = parse(
                option.structured_formatting.main_text,
                matches.map((match) => [match.offset, match.offset + match.length]),
                );

                return (
                <Grid container alignItems="center">
                    <Grid item>
                    <BookTwoTone className={classes.icon} />
                    </Grid>
                    <Grid item xs>
                    {parts.map((part, index) => (
                        <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                        {part.text}
                        </span>
                    ))}

                    <Typography variant="body2" color="textSecondary">
                        {option.structured_formatting.secondary_text}
                    </Typography>
                    </Grid>
                </Grid>
                );
            }}
        />
    </>
}