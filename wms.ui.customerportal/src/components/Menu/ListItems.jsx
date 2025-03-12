import React, { useEffect, useState } from 'react'
import { Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

import EqualizerIcon from '@mui/icons-material/Equalizer';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import ConstructionIcon from '@mui/icons-material/Construction';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import ReceiptIcon from '@mui/icons-material/Receipt';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import TableViewIcon from '@mui/icons-material/TableView';
import HomeIcon from '@mui/icons-material/Home';
import BuildIcon from '@mui/icons-material/Build';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { userAPI } from '../../services/userAPI';
import { getTokenInfo } from '../../utils';

import { RECEIVES_ROUTE, YARD_SUMMARY_ROUTE, REQUIREMENTS_ROUTE, INVENTORY_ROUTE, SHIPPING_ROUTE, DASHBOARD_3PL_ROUTE, DASHBOARD_VIEW_ROUTE, DASHBOARD_SET_ROUTE, DASHBOARD_SETTINGS_ROUTE } from "../../Pages/routes";


export const ListItems = () => {
	const [tokenInfo, setTokenInfo] = useState('');
	const [userInfo, setUserInfo] = useState('');
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const ldata = getTokenInfo();
		let lintid = ldata.nameid;
		setTokenInfo(lintid);
	}, []);

	useEffect(() => {
		if (tokenInfo) {
			const fetchUserInfo = async () => {
				try {
					const filters = { UserId: tokenInfo, UserName: "", PWD: "", Type: "" }
					const response = await userAPI.getUserInfo2(filters);
					setUserInfo(response.data[0]);
				} catch (error) {
					console.log('Error fetching data: ', error);
				}
			}
			fetchUserInfo();
		}
	}, [tokenInfo]);

	const handleNavigation = (page) => {
		navigate(page);
	};

	const handleClick = () => {
		setOpen(!open);
	};

	return (
		<List sx={{ width: '100%' }}>
			{/* Dashboard 3PL */}
			<ListItemButton
				onClick={() => handleNavigation(DASHBOARD_3PL_ROUTE)}
				sx={{
					py: 1.3,
					'&:hover': {
						backgroundColor: 'rgba(255, 255, 255, 0.08)'
					}
				}}
			>
				<ListItemIcon sx={{ minWidth: 40 }}>
					<EqualizerIcon sx={{ color: 'white' }} />
				</ListItemIcon>
				<ListItemText
					primary='Dashboard 3PL'
					sx={{
						color: 'white',
						'& .MuiTypography-root': {
							fontSize: '0.875rem'
						}
					}}
				/>
			</ListItemButton>
			{/* Dashboard Customer */}
			<ListItemButton
				onClick={handleClick}
				sx={{
					py: 1.3,
					'&:hover': {
						backgroundColor: 'rgba(255, 255, 255, 0.08)'
					}
				}}
			>
				<ListItemIcon sx={{ minWidth: 40 }}>
					<EqualizerIcon sx={{ color: 'white' }} />
				</ListItemIcon>
				<ListItemText
					primary="Dashboard Customer"
					sx={{
						color: 'white',
						'& .MuiTypography-root': {
							fontSize: '0.875rem'
						}
					}}
				/>
				{open ?
					<ExpandLess sx={{ color: 'white', ml: 1 }} /> :
					<ExpandMore sx={{ color: 'white', ml: 1 }} />
				}
			</ListItemButton>
			{/* Opciones de Dashboard Customer */}
			<Collapse in={open} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					<ListItemButton
						sx={{
							pl: 7,
							py: 1.3,
							'&:hover': {
								backgroundColor: 'rgba(255, 255, 255, 0.08)'
							}
						}}
					>
						<ListItemIcon sx={{ minWidth: 40 }}>
							<ViewQuiltIcon sx={{ color: 'white' }} />
						</ListItemIcon>
						<ListItemText
							onClick={() => handleNavigation(DASHBOARD_VIEW_ROUTE)}
							primary='Dashboard View'
							sx={{
								color: 'white',
								'& .MuiTypography-root': {
									fontSize: '0.875rem'
								}
							}}
						/>
					</ListItemButton>
					<ListItemButton
						sx={{
							pl: 7,
							py: 1.3,
							'&:hover': {
								backgroundColor: 'rgba(255, 255, 255, 0.08)'
							}
						}}
					>
						<ListItemIcon sx={{ minWidth: 40 }}>
							<BuildIcon sx={{ color: 'white', fontSize: '20px' }} />
						</ListItemIcon>
						<ListItemText
							onClick={() => handleNavigation(DASHBOARD_SET_ROUTE)}
							primary='Dashboard Set'
							sx={{
								color: 'white',
								'& .MuiTypography-root': {
									fontSize: '0.875rem'
								}
							}}
						/>
					</ListItemButton>
				</List>
			</Collapse>
			{/* Yard Management */}
			<ListItemButton
				onClick={() => handleNavigation(YARD_SUMMARY_ROUTE)}
				sx={{
					py: 1.3,
					'&:hover': {
						backgroundColor: 'rgba(255, 255, 255, 0.08)'
					}
				}}
			>
				<ListItemIcon sx={{ minWidth: 40 }}>
					<TableViewIcon sx={{ color: 'white' }} />
				</ListItemIcon>
				<ListItemText
					primary='Yard Management'
					sx={{
						color: 'white',
						'& .MuiTypography-root': {
							fontSize: '0.875rem'
						}
					}}
				/>
			</ListItemButton>
			{/* Receives */}
			<ListItemButton
				onClick={() => handleNavigation(RECEIVES_ROUTE)}
				sx={{
					py: 1.3,
					'&:hover': {
						backgroundColor: 'rgba(255, 255, 255, 0.08)'
					}
				}}
			>
				<ListItemIcon sx={{ minWidth: 40 }}>
					<CallReceivedIcon sx={{ color: 'white' }} />
				</ListItemIcon>
				<ListItemText
					primary='Receives'
					sx={{
						color: 'white',
						'& .MuiTypography-root': {
							fontSize: '0.875rem'
						}
					}}
				/>
			</ListItemButton>
			{/* Inventory */}
			<ListItemButton
				onClick={() => handleNavigation(INVENTORY_ROUTE)}
				sx={{
					py: 1.3,
					'&:hover': {
						backgroundColor: 'rgba(255, 255, 255, 0.08)'
					}
				}}
			>
				<ListItemIcon sx={{ minWidth: 40 }}>
					<InventoryIcon sx={{ color: 'white' }} />
				</ListItemIcon>
				<ListItemText
					primary='Inventory'
					sx={{
						color: 'white',
						'& .MuiTypography-root': {
							fontSize: '0.875rem'
						}
					}}
				/>
			</ListItemButton>
			{/* Cycle Counts */}
			<ListItemButton
				sx={{
					py: 1.3,
					'&:hover': {
						backgroundColor: 'rgba(255, 255, 255, 0.08)'
					}
				}}
			>
				<ListItemIcon sx={{ minWidth: 40 }}>
					<RotateRightIcon sx={{ color: 'white' }} />
				</ListItemIcon>
				<ListItemText
					primary='Cycle Counts'
					sx={{
						color: 'white',
						'& .MuiTypography-root': {
							fontSize: '0.875rem'
						}
					}}
				/>
			</ListItemButton>
			{/* Re-Works */}
			<ListItemButton
				sx={{
					py: 1.3,
					'&:hover': {
						backgroundColor: 'rgba(255, 255, 255, 0.08)'
					}
				}}
			>
				<ListItemIcon sx={{ minWidth: 40 }}>
					<ConstructionIcon sx={{ color: 'white' }} />
				</ListItemIcon>
				<ListItemText
					primary='Re-Works'
					sx={{
						color: 'white',
						'& .MuiTypography-root': {
							fontSize: '0.875rem'
						}
					}}
				/>
			</ListItemButton>
			{/* Quality Status */}
			<ListItemButton
				sx={{
					py: 1.3,
					'&:hover': {
						backgroundColor: 'rgba(255, 255, 255, 0.08)'
					}
				}}
			>
				<ListItemIcon sx={{ minWidth: 40 }}>
					<QueryStatsIcon sx={{ color: 'white' }} />
				</ListItemIcon>
				<ListItemText
					primary='Quality Status'
					sx={{
						color: 'white',
						'& .MuiTypography-root': {
							fontSize: '0.875rem'
						}
					}}
				/>
			</ListItemButton>
			{/* Shipping */}
			<ListItemButton
				onClick={() => handleNavigation(SHIPPING_ROUTE)}
				sx={{
					py: 1.3,
					'&:hover': {
						backgroundColor: 'rgba(255, 255, 255, 0.08)'
					}
				}}
			>
				<ListItemIcon sx={{ minWidth: 40 }}>
					<LocalShippingIcon sx={{ color: 'white' }} />
				</ListItemIcon>
				<ListItemText
					primary='Shipping'
					sx={{
						color: 'white',
						'& .MuiTypography-root': {
							fontSize: '0.875rem'
						}
					}}
				/>
			</ListItemButton>
			{/* Invoicing */}
			<ListItemButton
				sx={{
					py: 1.3,
					'&:hover': {
						backgroundColor: 'rgba(255, 255, 255, 0.08)'
					}
				}}
			>
				<ListItemIcon sx={{ minWidth: 40 }}>
					<ReceiptIcon sx={{ color: 'white' }} />
				</ListItemIcon>
				<ListItemText
					primary='Invoicing'
					sx={{
						color: 'white',
						'& .MuiTypography-root': {
							fontSize: '0.875rem'
						}
					}}
				/>
			</ListItemButton>
			{/* Requirements */}
			<ListItemButton
				onClick={() => handleNavigation(REQUIREMENTS_ROUTE)}
				sx={{
					py: 1.3,
					'&:hover': {
						backgroundColor: 'rgba(255, 255, 255, 0.08)'
					}
				}}
			>
				<ListItemIcon sx={{ minWidth: 40 }}>
					<InsertDriveFileIcon sx={{ color: 'white' }} />
				</ListItemIcon>
				<ListItemText
					primary="Requirements"
					sx={{
						color: 'white',
						'& .MuiTypography-root': {
							fontSize: '0.875rem'
						}
					}}
				/>
			</ListItemButton>
			{/* Dashboard Settings (Solo admins) */}
			{userInfo.canOpenKPIManagerW == 1 ?
				<ListItemButton
					onClick={() => handleNavigation(DASHBOARD_SETTINGS_ROUTE)}
					sx={{
						py: 1.3,
						'&:hover': {
							backgroundColor: 'rgba(255, 255, 255, 0.08)'
						}
					}}
				>
					<ListItemIcon sx={{ minWidth: 40 }}>
						<BuildIcon sx={{ color: 'white' }} />
					</ListItemIcon>
					<ListItemText
						primary="Dashboarding Settings"
						sx={{
							color: 'white',
							'& .MuiTypography-root': {
								fontSize: '0.875rem'
							}
						}}
					/>
				</ListItemButton>
				:
				null
			}
		</List>
	);
}
