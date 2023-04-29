import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import ProgressCircle from "./ProgressCircle";
import EmailIcon from "@mui/icons-material/Email";

const StatBox = ({ title, subtitle, increase, icon }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          
          <Typography
            variant="h4"
            sx={{ color: colors.grey[500] }}
          >
            {title}
          </Typography>
        </Box>
        <Box>
        {icon}
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" >
        <Typography variant="h3" fontWeight="bold" sx={{ color: colors.greenAccent[200] }}>
          {subtitle}
        </Typography>
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
