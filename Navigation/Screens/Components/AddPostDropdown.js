import React from 'react'
import {Dropdown} from "react-native-element-dropdown"

export default function DropdownInput ({data, labelField, valueField, placeholder, onChange, value, renderItem, customStyle}) {
        return (
            <Dropdown
                style = {{
                    height: 50,
                    borderRadius: 10,
                    paddingHorizontal: 16,
                    backgroundColor: 'whitesmoke',
                    ...customStyle
                }}
                placeholderStyle = {{}}
                selectedTextStyle = {{}}
                inputSearchStyle = {{
                    borderBottomWidth: 0,
                    backgroundColor: '#f2f2f2',
                    borderRadius: 20,
                    paddingHorizontal: 12,
                    marginHorizontal: 16,
                    marginBottom: 8,
                }}
                iconStyle = {{
                    width: 20,
                    height: 20,
                    marginRight: 8,
                }}
                data = {data}
                search
                labelField = {labelField}
                valueField = {valueField}
                placeholder = {placeholder}
                searchPlaceholder = "Search..."
                value = {value}
                onFocus = {() => setIsFocus(true)}
                onBlur = {() => setIsFocus(false)}
                renderItem = {renderItem}
                onChange = {onChange}
            />
        )
    }
    
